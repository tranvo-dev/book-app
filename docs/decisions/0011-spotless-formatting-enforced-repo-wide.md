# 0011. Enforce formatting repo-wide with Spotless + pre-commit hook, not per-service

- Status: Accepted
- Date: 2026-07-12
- Scope: global

## Context

This is a multi-module Maven repo (multiple independent Spring Boot services, each
with its own parent POM). Configuring Spotless separately in each service's `pom.xml`
would drift over time and requires every new service to remember to add it.

## Decision

Configure Spotless (Palantir Java Format) once in the repo-root `pom.xml` as an
aggregator, so `mvn spotless:apply` / `mvn spotless:check` covers every service's
Java code from one place. Wire `spotless:check` into a pre-commit git hook under
`.githooks/` so unformatted code can't be committed. Pair with `.github/CODEOWNERS`
for review ownership.

## Consequences

- Formatting is consistent across all services with no per-service setup.
- Any new service under `services/` is covered automatically, nothing to configure.
- Contributors must have the repo's git hooks path configured for the pre-commit
  check to run locally (documented in README).

## References

- Commit: `8e0f914` — feat: setup spotless
- Commit: `fecf3bb` — feat: setup CODEOWNERS
- Commit: `09d8130` — chore: synchronize deps versions and update README.md
