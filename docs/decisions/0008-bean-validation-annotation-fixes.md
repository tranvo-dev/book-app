# 0008. Don't use `@NonNull`/`@Min` for required-string validation on records

- Status: Accepted
- Date: 2026-07-19
- Scope: book-authorization-server

## Context

A registration request record used `@Min` on a `String` field (no effect — `@Min`
only constrains numeric types, so it silently validated nothing) and `@NonNull`
on a field expected to be user-supplied. Lombok/Jakarta `@NonNull` throws a raw
`NullPointerException` at construction time rather than participating in Bean
Validation's normal violation-reporting flow, so a missing field in the incoming
record caused an unhandled exception (HTTP 500) and left part of
`RegistrationController` unreachable instead of returning a normal validation
error response.

## Decision

Remove `@Min` from string fields (it does nothing there) and remove `@NonNull`
from request DTO fields; rely on proper Jakarta Bean Validation annotations
(e.g. `@NotBlank`) that integrate with Spring's validation error handling instead
of throwing raw NPEs.

## Consequences

- Missing/invalid registration fields now return a normal 4xx validation error
  instead of a 500.
- Establishes the convention: validation annotations on request DTOs must be ones
  Spring's validation pipeline understands and reports, not Lombok's `@NonNull`.

## References

- Commit: `a86af1b` — refactor: remove @NonNull and @Min
