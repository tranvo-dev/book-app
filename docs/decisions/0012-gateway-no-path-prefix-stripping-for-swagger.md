# 0012. Don't rely on gateway path-prefix stripping for service-hosted Swagger UI

- Status: Accepted
- Date: 2026-08-12
- Scope: book-client-gateway, book-core-service

## Context

The gateway forwards `/books/**` to `book-core-service` without `StripPrefix`, so
`/books/swagger-ui.html` reached the service as-is, but `book-core-service` serves
Swagger at `/swagger-ui.html` (no `/books` prefix) — 404. Even stripping the prefix
doesn't fully fix it: `swagger-ui.html` 302-redirects to `/swagger-ui/index.html`,
and its JS then fetches `/v3/api-docs` — both absolute paths with no `/books`
prefix, so they escape the `/books/**` route and 404 again. Swagger UI assumes it
is served from the application root; it cannot be cleanly piggybacked behind a
path prefix without deeper reverse-proxy rewriting.

## Decision

Accept that per-service Swagger UI is reached directly on each service (or via a
route that maps to the service root), rather than trying to force it to live
under a prefixed gateway path. Route path handling for actual API endpoints stays
prefix-based; Swagger UI is treated as a separate, unprefixed concern.

## Consequences

- Avoids fragile gateway rewrite rules chasing every absolute path Swagger UI's
  JS happens to fetch.
- Swagger UI access pattern differs from normal API access pattern — worth calling
  out to anyone adding a new service's docs route.

## References

- Commit: `ad7f224` — fix: remove path segment
