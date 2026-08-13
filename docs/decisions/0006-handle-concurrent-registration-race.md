# 0006. Catch `DataIntegrityViolationException` instead of relying on pre-check for duplicate registration

- Status: Accepted
- Date: 2026-07-19
- Scope: book-authorization-server

## Context

User registration checked `findByEmail` before `save` to reject duplicate emails.
Under concurrent registration requests for the same email, both requests can pass
the `findByEmail` check before either has committed a `save`, so the DB's unique
constraint on `email` is what actually catches the duplicate — surfacing as an
unhandled `DataIntegrityViolationException` (HTTP 500) instead of a clean
validation error.

## Decision

Keep the `findByEmail` pre-check for the common case (fast, friendly error), but
also catch `DataIntegrityViolationException` around the `save` and translate it
into the same "email already registered" error response, so the race condition
degrades to the same user-facing behavior instead of a 500.

## Consequences

- No 500s from the registration race window, at the cost of one extra catch block
  as the actual source of truth for uniqueness.
- Confirms the DB unique constraint remains the real correctness guarantee — the
  service-level check is only an optimization for the common path, not something
  to remove in future refactors.

## References

- Commit: `a788739` — refactor: catch db exception DataIntegrityViolationException
