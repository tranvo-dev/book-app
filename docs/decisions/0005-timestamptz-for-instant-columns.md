# 0005. Use `TIMESTAMP WITH TIME ZONE` for all `Instant` entity fields

- Status: Accepted
- Date: 2026-07-19
- Scope: global

## Context

Entities used `java.time.Instant` fields mapped to Postgres `TIMESTAMP` (no time
zone) columns. `Instant` represents a fixed point on the UTC timeline, but a
timezone-less `TIMESTAMP` column has no way to record that — the stored value can
silently shift depending on the server/session timezone.

## Decision

Map all `Instant` entity fields to `TIMESTAMP WITH TIME ZONE` (`timestamptz`)
columns/Flyway migrations, never plain `TIMESTAMP`.

## Consequences

- Timestamps read back as the same instant regardless of DB/server timezone
  configuration.
- Any new entity with an `Instant` field must use `timestamptz` in its migration —
  worth checking for in review.

## References

- Commit: `ac4c5e0` — refactor: replace TIMESTAMP with TIMESTAMP WITH TIME ZONE
