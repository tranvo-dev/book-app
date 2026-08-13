---
paths:
  - "services/**/**"
---

# Spring Boot Project & Coding Conventions

## 1. Project Directory & Package Structure

* Follow the standard reversed domain name format (`com.tranvodev.**`).
* Organize components into strict, functional layers.

```text
book-core-service
├── compose.yaml                                    # Docker compose file to setup Database and other external services to run the application locally
├── pom.xml
└── src
    ├── generated
    │   └── openapi/                                # OpenAPI-generated sources (do NOT hand-edit)
    ├── main
    │   ├── java
    │   │   └── com/tranvodev/sample-service/
    │   │       ├── SampleServiceApplication.java   # Root level (Enables auto-scan)
    │   │       ├── config                          # Security, DB, JPA, 3rd party configurations
    │   │       ├── controllers                     # REST Endpoints / Routing only
    │   │       ├── dtos                            # Data Transfer Objects are not limited to API Requests and Responses. They must be utilized whenever data crosses an architectural boundary to prevent internal models (Entities) from leaking or tightly coupling different systems
    │   │       ├── entities                        # Database ORM mapping classes
    │   │       ├── exceptions                      # Custom exceptions & Global handler
    │   │       ├── mappers                         # MapStruct mapping interfaces (DTO <-> Entity)
    │   │       ├── repositories                    # Database access layer (Spring Data JPA)
    │   │       └── services                        # Core Business Logic 
    │   └── resources                               # Resource folder containing application configuration (in local, dev, prod), database migration, and open API spec
    │       ├── application.yaml                    # Application configuration in YAML format
    │       ├── static                              # Raw, unrendered public client assets (e.g., css/scss, javascript, images,...)
    │       ├── templates                           # Dynamic server-side templates (Thymeleaf, FreeMarker)
    │       ├── db/migration/                       # Flyway migrations
    │       └── openapi/                            # OpenAPI spec YAML file for the code generation
    └── test
        └── java
            └── com/tranvodev/book_core_service/    # Contains test files of the projects
```
---

## 2. Layer-by-Layer Rules

### Controller Layer
* **Annotation**: Mark classes with `@RestController`. Do not use raw servlets or standard `@Controller` unless rendering templates.
* **Logic**: Restrict code to routing, input validation, and HTTP status mappings. Never write business logic here.
* **Naming**: Use **PascalCase** suffixed with `Controller` (e.g., `UserController`).
* **Dependency Injection**: Use constructor injection or Lombok's `@RequiredArgsConstructor`. Do not use field injection via `@Autowired`.

### Service Layer
* **Annotation**: Mark implementations with `@Service`.
* **Logic**: Restrict all core business processing and transaction rules to this layer.
* **Naming**: Suffixed with `Service` (e.g., `UserService`). Start methods with a lowercase action verb (e.g., `createUser`).

### Repository Layer
* **Interface**: Extend `JpaRepository<Entity, Id>` or `CrudRepository`.
* **Naming**: Suffixed with `Repository` (e.g., `UserRepository`).
* **Logic**: Rely on Spring Data derivation rules for queries. Avoid writing manual native queries unless optimization dictates it.

### Mappers
* **Naming**: Suffixed with `Mapper` (e.g., `UserMapper`).

### Model / Data Layer
* **Entities**: Mark pure database mappings with `@Entity`. Never return an entity directly through a controller.
* **DTOs**: Use dedicated classes (e.g., `UserResponseDto`, `CreateUserRequestDto`) for API request parsing and response rendering.

#### DTO Scope & Typology
DTOs (Data Transfer Objects) are not limited to API Requests and Responses. They must be utilized whenever data crosses an architectural boundary to prevent internal models (Entities) from leaking or tightly coupling different systems.

* **API DTOs (Request/Response)**: Generated automatically by OpenAPI from the `components/schemas` section. Used strictly for ingress/egress validation and formatting.
* **Internal / Message DTOs**: Handwritten or generated payloads used to send data over Event/Message Brokers (e.g., Kafka, RabbitMQ).
* **Integration / Feign DTOs**: Structures mapping external downstream API responses. Prevents external API mutations from breaking internal system logic.
* **CQRS Projection DTOs**: Read-only optimized models designed specifically for specialized reporting UI views or complex aggregate lookups.
---

## 3. General Architecture & Design Best Practices

* **Exception Handling**: Standardize error schemas globally via a centralized `@RestControllerAdvice` class.
* **Validation**: Enforce inputs at the API gateway layer using `jakarta.validation` annotations (e.g., `@NotNull`, `@Size`, `@Email`) on DTO fields.
* **Boilerplate**: Reduce visual clutter by adopting Lombok annotations (`@Getter`, `@Setter`, `@RequiredArgsConstructor`, `@NoArgsConstructor`).
* **Configuration**: Manage environment variables strictly using profile-driven files (`application.properties` or `application.yml`) located in `src/main/resources/`.
---

## 4. OpenAPI Generator Conventions

* **Contract-First Design**: The YAML OpenAPI specification file (located in `src/main/resources/openapi/**.yaml`) acts as the single source of truth. Always modify the spec file first; never modify generated code.
* **Delegation Pattern**: Configure the generator plugin to use `interfaceOnly=true`.
* **Implementation Rule**: Controllers must implement the generated API interface or inject the generated delegate. Keep endpoints clean of mapping logic.
* **Validation**: Rely on OpenAPI generated `jakarta.validation` annotations (e.g., `@Valid`, `@NotNull`) to intercept bad payload formatting automatically.
---

## 5. MapStruct Mapping Rules

* **Boundary Isolation**: Entities must never leak into the controller layer. DTOs must never leak into the repository layer. Use MapStruct mappers as the sole translator between layers.
* **Configuration**: Define mappers as Spring Beans using `componentModel = "spring"`.
* **Immutability**: Since OpenAPI generates standard Java POJOs or Records, configure MapStruct to handle field-to-field matching cleanly. Use `unmappedTargetPolicy = ReportingPolicy.ERROR` during development to catch missing field configurations early.

### MapStruct Implementation Template

```java
package com.company.project.api.mapper;

import com.company.project.domain.entity.UserEntity;
import com.company.project.generated.model.UserRequestDto;
import com.company.project.generated.model.UserResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface UserMapper {

    // Map incoming OpenAPI Request DTO to Database Entity
    @Mapping(target = "id", ignore = true) // DB autogenerates ID
    @Mapping(target = "status", constant = "ACTIVE")
    UserEntity toEntity(UserRequestDto requestDto);

    // Map Database Entity to outgoing OpenAPI Response DTO
    UserResponseDto toResponseDto(UserEntity entity);

    // Merge changes from an incoming Update DTO into an existing Entity context
    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(UserRequestDto requestDto, @MappingTarget UserEntity entity);
}
```