# 0009. Contract-first API for book-core-service via OpenAPI Generator

- Status: Accepted
- Date: 2026-07-04
- Scope: book-core-service

## Context

`book-core-service` is the main resource API (books, attachments, read progress)
and benefits from a machine-checkable contract that both documents the API and
keeps controller signatures honest against it, rather than generating docs after
the fact from annotations alone.

## Decision

Use the OpenAPI Generator to generate API interfaces/DTOs
(`src/generated/openapi`) from a spec, and implement controllers against the
generated interfaces (e.g. `BooksApi`, `ErrorResponse`). `springdoc-openapi` still
serves interactive Swagger UI at runtime for the other services / general docs.

## Consequences

- The generated code is checked in under `src/generated`, making a diff visible
  whenever the contract changes.
- Controllers implementing generated interfaces get compile-time drift detection
  between the spec and the implementation.
- Regenerating requires re-running the generator when the spec changes — not a
  fully automatic sync.

## References

- Commit: `22b78de` — feat: rename service (introduces `src/generated/openapi`)
- README.md § API Docs
