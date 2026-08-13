# Architecture Decision Records (ADRs)

This folder captures the *why* behind implementation choices made in this project —
so anyone (including future you) can reference a decision and understand the
reasoning, alternatives, and trade-offs without re-deriving them from the code or
commit history.

## When to add one

Add a new ADR whenever you:
- Choose between two or more viable technical approaches
- Fix a bug whose root cause reveals a non-obvious constraint (e.g. a framework
  quirk, a config gotcha)
- Introduce, remove, or replace a dependency for a specific reason
- Make a call that a reviewer or new contributor would reasonably ask "why?" about

Small, obvious refactors or pure formatting changes don't need one.

## How to add one

1. Copy `TEMPLATE.md` to `NNNN-short-kebab-title.md`, where `NNNN` is the next
   sequential number (see index below).
2. Fill in Context / Decision / Consequences. Keep it short — a few sentences per
   section is usually enough.
3. Link the originating commit(s)/PR if there is one.
4. Add a row to the index table below.

## Statuses

- **Proposed** — under discussion, not yet implemented
- **Accepted** — implemented and current
- **Superseded by NNNN** — replaced by a later decision (keep the old file, don't delete)
- **Deprecated** — no longer applies (e.g. component removed)

## Index

| ID | Title | Scope | Status | Date |
|----|-------|-------|--------|------|
| [0001](0001-microservice-split-oauth2.md) | Split into 3 services around OAuth2 roles ("dumb gateway, smart services") | global | Accepted | 2026-08-12 |
| [0002](0002-session-strategy-gateway-vs-resource-server.md) | Stateful session at the gateway, stateless JWT at resource servers | global | Accepted | 2026-08-12 |
| [0003](0003-jwt-local-validation-via-jwks.md) | Resource servers validate JWTs locally via cached JWK set | book-core-service, book-authorization-server | Accepted | 2026-07-23 |
| [0004](0004-client-secret-password-encoder-delegation.md) | Delegate client-secret encoding instead of a single fixed PasswordEncoder bean | book-authorization-server | Accepted | 2026-07-26 |
| [0005](0005-timestamptz-for-instant-columns.md) | Use `TIMESTAMP WITH TIME ZONE` for all `Instant` entity fields | global | Accepted | 2026-07-19 |
| [0006](0006-handle-concurrent-registration-race.md) | Catch `DataIntegrityViolationException` instead of relying on pre-check for duplicate registration | book-authorization-server | Accepted | 2026-07-19 |
| [0007](0007-mapstruct-spring-component-model.md) | MapStruct mappers use `componentModel = "spring"` | global | Accepted | 2026-07-19 |
| [0008](0008-bean-validation-annotation-fixes.md) | Don't use `@NonNull`/`@Min` for required-string validation on records | book-authorization-server | Accepted | 2026-07-19 |
| [0009](0009-openapi-contract-first-core-service.md) | Contract-first API for book-core-service via OpenAPI Generator | book-core-service | Accepted | 2026-07-04 |
| [0010](0010-gcs-storage-with-dedup-upload.md) | Google Cloud Storage for attachments, with duplicate-content handling | book-core-service | Accepted | 2026-06-08 |
| [0011](0011-spotless-formatting-enforced-repo-wide.md) | Enforce formatting repo-wide with Spotless + pre-commit hook, not per-service | global | Accepted | 2026-07-12 |
| [0012](0012-gateway-no-path-prefix-stripping-for-swagger.md) | Don't rely on gateway path-prefix stripping for service-hosted Swagger UI | book-client-gateway, book-core-service | Accepted | 2026-08-12 |

Numbers are never reused. If a decision is reversed, mark the old ADR as
*Superseded by NNNN* and write a new one — don't edit history away.
