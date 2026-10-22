# CLAUDE.md

Guidance for Claude Code working in this repo. Read `README.md` for the full architecture, OAuth2 flow diagram, and setup details.

## What this is

Book App — a multi-service Java 21 / Spring Boot backend using an OAuth2 "smart gateway, dumb services" pattern. Three independent services under `services/`, each with its own Spring Boot parent version and build lifecycle (NOT a Maven reactor).

| Service | Role | Port (local) |
|---------|------|--------------|
| `book-client-gateway` | OAuth2 Client + Spring Cloud Gateway (WebFlux). Entry point; validates JWT locally via cached JWK set, forwards to auth/core. | 8081 |
| `book-authorization-server` | Spring Authorization Server. Manages users, authentication, authorization, token issuance. Thymeleaf login/register UI. | 9000 |
| `book-core-service` | OAuth2 Resource Server. Core book data, attachments, read-tracking. GCS storage, OpenFeign, Apache Tika. | 8080 |

## Tech stack

- Java 21, Spring Boot 4.0.x/4.1.x, Spring Cloud 2025.1.x
- PostgreSQL 17, Flyway migrations, Spring Data JPA / Hibernate
- MapStruct (mapping), Lombok (boilerplate)
- springdoc-openapi (Swagger UI). `book-core-service` also uses OpenAPI Generator (contract-first from `src/main/resources/openapi/`)
- Docker Compose per service for local Postgres

## Build & run

Each service builds independently. Use `-f` to target its pom.

Run a service (local profile):
```bash
mvn -f services/<service>/pom.xml spring-boot:run -Dspring-boot.run.profiles=local
```

Auth server and core service need their DB first:
```bash
docker compose -f services/<service>/compose.yaml up -d
```

## Formatting (enforced)

Spotless is configured ONCE at the repo-root `pom.xml`: Palantir Java Format for every service's Java, and Prettier (using `app/my-library/.prettierrc.json`) for the frontend's `src/**/*.{ts,tsx,scss,css}`. Keep the Spotless `prettierVersion` in sync with `prettier` in `app/my-library/package.json`. The root pom is a standalone formatting aggregator — it does NOT declare services as modules.

```bash
mvn spotless:apply    # format all services + frontend
mvn spotless:check    # verify (pre-commit hook + CI)
npm --prefix app/my-library run format    # Prettier only (frontend)
npm --prefix app/my-library run lint      # ESLint (frontend)
```

Pre-commit hook (`.githooks/pre-commit`, enable with `git config core.hooksPath .githooks`) runs `spotless:check` on staged Java + frontend files and ESLint (`--max-warnings=0`) on staged `.ts/.tsx`. Always run `mvn spotless:apply` before committing or the commit will be rejected.

## Package convention

Base package: `com.tranvodev.<service_name_underscored>` (e.g. `com.tranvodev.book_core_service`). Standard layout: `config`, `controllers`, `services`, `repositories`, `entities`, `dtos`, `mappers`, `advices`, `exceptions`.

## OpenAPI codegen (book-core-service)

Contract-first. Edit the spec in `src/main/resources/openapi/`; generated sources land in `src/generated/openapi/` — do NOT hand-edit generated files. Implement the generated API interfaces in `controllers/`.
