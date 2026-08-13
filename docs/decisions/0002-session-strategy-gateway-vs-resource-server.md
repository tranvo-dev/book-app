# 0002. Stateful session at the gateway, stateless JWT at resource servers

- Status: Accepted
- Date: 2026-08-12
- Scope: global

## Context

The browser talks to the gateway using cookies (natural for a browser client), but
internal service-to-service and gateway-to-resource-server calls should not depend
on sticky cookie state. Need to decide, per layer, whether sessions are stateful or
stateless.

## Decision

Two different models on purpose, one per layer:

1. **Gateway (stateful & protected)** — Needs a server-side session/cookie to hold
   the access token, refresh token, and user details after login. Because it relies
   on a browser cookie, Spring Security's CSRF protection stays enabled here. On
   each forwarded request the gateway strips the frontend cookie, reads the real
   JWT out of session storage, and injects `Authorization: Bearer <JWT>` before
   forwarding.
2. **Resource servers, e.g. book-core-service (stateless)** — Only accept requests
   carrying the `Authorization: Bearer <JWT>` header. No cookies, no server session,
   so CSRF protection is unnecessary here and is disabled.

## Consequences

- In-memory sessions at the gateway do not survive a restart and are not shared
  across multiple gateway instances behind a load balancer (see 0003-adjacent
  follow-up: known limitation, Redis-backed session store is the standard fix but
  not yet implemented).
- Resource servers remain horizontally scalable with zero shared session state.
- CSRF handling only needs to be reasoned about at the gateway, not in every
  resource service.

## References

- README.md § "Design decisions" (Q1–Q3)
