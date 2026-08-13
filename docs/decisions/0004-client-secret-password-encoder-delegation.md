# 0004. Delegate client-secret encoding instead of a single fixed PasswordEncoder bean

- Status: Accepted
- Date: 2026-07-26
- Scope: book-authorization-server

## Context

Local OAuth2 client registration used a `{noop}secret`-style client secret.
Spring Authorization Server resolves the client-secret encoder via
`OAuth2ConfigurerUtils.getPasswordEncoder()`, which picks up *any*
`PasswordEncoder` bean present in the context and only falls back to Spring's
delegating encoder when none exists. Because the app already defines a
`BCryptPasswordEncoder` bean (for user passwords), that single encoder bean was
also used to interpret the client secret — which broke on the non-BCrypt-prefixed
`{noop}secret` value, logging "Encoded password does not look like BCrypt" and
always returning false.

## Decision

Provide a `DelegatingPasswordEncoder`-style bean so prefix-less/`{noop}`-style
secrets are still handled correctly for client secrets, while user passwords stay
on BCrypt.

## Consequences

- Client secret matching no longer silently fails for unprefixed values.
- Reinforces that defining a single global `PasswordEncoder` bean in a Spring
  Authorization Server app has non-obvious blast radius — it's picked up
  everywhere the framework calls `getPasswordEncoder()`, not just for user auth.

## References

- Commit: `2f30b29` — fix: oauth2 redirection issues (Issue #3)
