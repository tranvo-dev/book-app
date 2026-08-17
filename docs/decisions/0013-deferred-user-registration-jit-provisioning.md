# 0013. Defer user registration via JIT provisioning keyed on JWT `sub`

- Status: Accepted
- Date: 2026-08-13
- Scope: book-core-service, book-authorization-server

## Context

Identity lives in `book-authorization-server` (owns credentials, issues JWTs, owns
the stable `sub` claim). `book-core-service` owns the domain user profile (the
`users` table, plus book ownership). Requiring a user to POST a full profile to
`book-core-service` before they can use the app duplicates identity, creates a
second up-front signup step, and leaves `UserEntity.id` (a DB-generated UUID) with
no link back to the authenticated principal.

We want: once a user has authenticated at the authorization server, their
`book-core-service` profile should come into existence without a separate explicit
registration call — "deferred registration". The open question was *when* and
*how* the profile row gets created, and how it links to the identity.

## Decision

Provision the profile Just-In-Time on the first authenticated request, keyed on
the JWT `sub` claim:

1. Add `subject VARCHAR(255) NOT NULL UNIQUE` to `users`, mapped as
   `UserEntity.subject`. This is the join between identity (`sub`) and profile, and
   is stable across email changes.
2. A `resolveCurrentUser(Jwt)` looks up `findBySubject`; if absent it provisions a
   **minimal** row from token claims (`sub`, `email`, name), lazily inside the
   domain service (option A) rather than a request filter or an event consumer.
3. The race between two concurrent first requests degrades cleanly: unique
   constraint on `subject` + catch `DataIntegrityViolationException` then re-read
   — the same pattern as [0006](0006-handle-concurrent-registration-race.md).
4. Extra profile data not present in the token (e.g. `phoneNumber`) is collected
   later via `PATCH /users/me` ("complete your profile"), not at provision time.
5. `GET /users/me` returns (and JIT-provisions) the caller's profile. The explicit
   `POST /users` register endpoint is dropped — the client no longer POSTs identity
   to the resource server.

## Alternatives considered

- **Request filter / interceptor (option B)** — provision transparently before the
  controller. Rejected: runs on every request including health checks, and wastes
  rows for callers that never touch user-scoped data.
- **Event-driven (option C)** — authorization server emits `UserRegistered`, core
  consumes it. Rejected for now: no message broker exists in the stack yet;
  overkill. Revisit if a profile must exist *before* first login.
- **Keep explicit `POST /users`** — rejected: duplicates the identity already
  created at the authorization server and forces a redundant signup step.

## Gap: JIT only fires on `GET /users/me`

As implemented, `resolveCurrentUser(jwt)` is called only from `GET /users/me`. A user
who authenticates and does anything else first has no profile row, so `owner_id UUID
NOT NULL` (FK to `users(id)`) cannot be satisfied and book/attachment writes fail.

**Resolution:** extract a single `CurrentUserProvider.require(Jwt)` returning the
JIT-provisioned `UserEntity`, and call it from *every* user-scoped operation (not just
`/users/me`) to supply `owner`. Keeps option A; closes the "profile assumed but never
created" gap.

## Migration: `users.id` from `BIGINT` to `UUID`

To make identity stable and non-guessable across services, the authorization
server's `users.id` was migrated from `BIGSERIAL` (`BIGINT`) to `UUID`. This aligns
the identity store with `book-core-service`, whose `users.id` is already `UUID`
(`gen_random_uuid()`), and removes sequential, enumerable primary keys from the
principal.

The migration (`book-authorization-server`, `V2__alter_user_table_user_id_column.sql`)
converts in place rather than dropping and recreating the column, preserving existing
rows and any foreign keys:

```sql
ALTER TABLE users
ALTER COLUMN id DROP DEFAULT,
ALTER COLUMN id TYPE UUID USING CAST(LPAD(TO_HEX(id), 32, '0') AS UUID),
ALTER COLUMN id SET DEFAULT gen_random_uuid();
```

Steps:

1. **Drop the `BIGSERIAL` default** — detach the sequence so the column type can change.
2. **Cast existing `BIGINT` values to `UUID`** — `TO_HEX(id)` renders the integer as
   hex, `LPAD(..., 32, '0')` zero-pads to a full 32-hex-digit (128-bit) UUID, then
   `CAST(... AS UUID)`. Existing IDs map deterministically (e.g. `1` →
   `00000000-0000-0000-0000-000000000001`), so old references stay valid.
3. **Set `gen_random_uuid()` as the new default** — new rows get random UUIDs instead
   of sequential integers.

Notes / caveats:

- Any `BIGINT` foreign keys referencing `users.id` must be converted with the same
  `TO_HEX`/`LPAD`/`CAST` expression in the same migration, or the FK will break.
- The conversion is one-way; a rollback would need to reverse the padded-hex encoding
  and is only lossless while every UUID still fits the original integer range.
- New random UUIDs are non-sequential, so index locality on `id` differs from
  `BIGSERIAL`; acceptable at current scale.

## Consequences

- Profile rows exist only for users who actually use `book-core-service`; no
  up-front signup form against the resource server.
- `UserEntity` is now linked to the principal via `subject`, enabling `/users/me`
  and per-user data ownership.
- JIT is idempotent by design, so the "user already exists" 409 path and
  `UserAlreadyExistedException` are no longer needed in `book-core-service`.
- New race window on `subject` insert, handled by the same catch-and-reread pattern
  as ADR 0006.
- JIT currently fires only on `GET /users/me`, so other user-scoped operations assume
  a profile that may not exist; see [Gap](#gap-jit-only-fires-on-get-usersme) for the
  `CurrentUserProvider.require(Jwt)` resolution.
- Follow-up: DB migration for `subject`, `resolveCurrentUser`, and the
  `GET`/`PATCH /users/me` endpoints in the OpenAPI contract.

## References

- Supersedes the explicit-registration direction in the initial `POST /users` spec.
- Related: [0006](0006-handle-concurrent-registration-race.md),
  [0003](0003-jwt-local-validation-via-jwks.md).
