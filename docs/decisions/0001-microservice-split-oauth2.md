# 0001. Split into 3 services around OAuth2 roles ("dumb gateway, smart services")

- Status: Accepted
- Date: 2026-08-12
- Scope: global

## Context

The app needs authentication/authorization shared across future resource services,
plus a single public entry point for clients. Putting auth logic, routing, and
business logic in one deployable would couple unrelated concerns and block
independent scaling/deployment of each responsibility.

## Decision

Split the system into three Spring services, each mapped 1:1 to a standard OAuth2
role:

- `book-authorization-server` — Authorization Server (Spring Authorization Server):
  owns users, login, consent, token issuance.
- `book-client-gateway` — OAuth2 Client + Spring Cloud Gateway (WebFlux): the only
  public entry point; forwards authenticated requests downstream.
- `book-core-service` — OAuth2 Resource Server: owns actual business data (books,
  attachments, read progress) and validates JWTs itself instead of trusting the
  gateway blindly.

The gateway stays intentionally "dumb": it does not re-implement authorization
decisions, it forwards the bearer token and lets each resource server enforce its
own access rules ("dumb gateway, smart services" — see commit `628ac98`, which
walked this back from an earlier version where the gateway carried more security
logic).

## Alternatives considered

- Monolith with in-process auth module — rejected: doesn't scale to multiple
  resource services later, and mixes deployment lifecycles.
- "Smart gateway" that fully authorizes requests before forwarding — rejected:
  duplicates trust logic in two places and makes resource servers unable to run
  securely if ever exposed directly (e.g. service-to-service).

## Consequences

- Each service can be deployed/scaled independently.
- Resource servers must each carry their own JWT validation config (see 0003).
- Any new resource service follows the same pattern instead of inventing its own.

## References

- Commit: `628ac98` — fix: change the pattern to dumb gateway, smart services
- Commit: `b637836` — feat: setup oauth2 auth server, resource server and client
- Commit: `22b78de` — feat: rename service
