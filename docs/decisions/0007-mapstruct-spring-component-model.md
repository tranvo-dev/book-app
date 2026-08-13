# 0007. MapStruct mappers use `componentModel = "spring"`

- Status: Accepted
- Date: 2026-07-19
- Scope: global

## Context

`UserMapper` (and MapStruct mappers generally) need to be injected into Spring
beans (e.g. services, controllers). Without a component model, MapStruct generates
a plain implementation class with a static `INSTANCE` field/no-arg constructor
instead of a Spring bean, so `@Autowired`/constructor injection of the mapper
fails to wire.

## Decision

All MapStruct `@Mapper` interfaces are annotated with
`@Mapper(componentModel = "spring")` so generated implementations register as
Spring beans and can be constructor-injected like any other service.

## Consequences

- Mappers are injectable everywhere without extra wiring.
- This is the default going forward for any new mapper in any service — a mapper
  without it is a bug, not a style choice.

## References

- Commit: `64dcce3` — refactor: add `componentModel = "spring"`
