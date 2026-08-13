# 0003. Resource servers validate JWTs locally via cached JWK set

- Status: Accepted
- Date: 2026-07-23
- Scope: book-core-service, book-authorization-server

## Context

Every API call from the gateway to a resource server needs to be authenticated.
Validating tokens by calling back to the authorization server on every request
would add a network hop and a hard runtime dependency to the request path.

## Decision

`book-authorization-server` exposes its signing keys at
`/api/v1/auth/oauth2/jwks` (configured via `JwkSourceConfig`). Resource servers
(`book-core-service`, and originally `book-client-gateway` — see 3330a86) validate
JWTs locally against a cached copy of that JWK set, so no call to the authorization
server is made per request.

## Consequences

- Token validation adds no extra network round-trip per request.
- A resource server can keep working briefly even if the authorization server is
  temporarily unreachable, as long as its JWK cache is warm.
- Key rotation on the authorization server needs the JWK cache TTL to be short
  enough that resource servers pick up new keys in reasonable time.

## References

- Commit: `acf2410` — feat: config jwkSource for auth server
- Commit: `5da1366` — feat: add spring oauth2 resource server for token validation
- README.md sequence diagram, "Oauth2 Main Flow"
