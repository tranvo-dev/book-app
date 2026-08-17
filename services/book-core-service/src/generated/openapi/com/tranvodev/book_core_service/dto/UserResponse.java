package com.tranvodev.book_core_service.dto;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.UUID;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * UserResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.22.0")
public class UserResponse {

  private UUID id;

  private String firstName;

  private @Nullable String lastName;

  private String email;

  private @Nullable String phoneNumber;

  public UserResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public UserResponse(UUID id, String firstName, String email) {
    this.id = id;
    this.firstName = firstName;
    this.email = email;
  }

  public UserResponse id(UUID id) {
    this.id = id;
    return this;
  }

  /**
   * Unique identifier of the user.
   * @return id
   */
  @NotNull @Valid 
  @Schema(name = "id", description = "Unique identifier of the user.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("id")
  public UUID getId() {
    return id;
  }

  @JsonProperty("id")
  public void setId(UUID id) {
    this.id = id;
  }

  public UserResponse firstName(String firstName) {
    this.firstName = firstName;
    return this;
  }

  /**
   * The user's first name.
   * @return firstName
   */
  @NotNull 
  @Schema(name = "firstName", description = "The user's first name.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("firstName")
  public String getFirstName() {
    return firstName;
  }

  @JsonProperty("firstName")
  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public UserResponse lastName(@Nullable String lastName) {
    this.lastName = lastName;
    return this;
  }

  /**
   * The user's last name.
   * @return lastName
   */
  
  @Schema(name = "lastName", description = "The user's last name.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("lastName")
  public @Nullable String getLastName() {
    return lastName;
  }

  @JsonProperty("lastName")
  public void setLastName(@Nullable String lastName) {
    this.lastName = lastName;
  }

  public UserResponse email(String email) {
    this.email = email;
    return this;
  }

  /**
   * The user's email address.
   * @return email
   */
  @NotNull @jakarta.validation.constraints.Email 
  @Schema(name = "email", description = "The user's email address.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("email")
  public String getEmail() {
    return email;
  }

  @JsonProperty("email")
  public void setEmail(String email) {
    this.email = email;
  }

  public UserResponse phoneNumber(@Nullable String phoneNumber) {
    this.phoneNumber = phoneNumber;
    return this;
  }

  /**
   * The user's phone number.
   * @return phoneNumber
   */
  
  @Schema(name = "phoneNumber", description = "The user's phone number.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("phoneNumber")
  public @Nullable String getPhoneNumber() {
    return phoneNumber;
  }

  @JsonProperty("phoneNumber")
  public void setPhoneNumber(@Nullable String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    UserResponse userResponse = (UserResponse) o;
    return Objects.equals(this.id, userResponse.id) &&
        Objects.equals(this.firstName, userResponse.firstName) &&
        Objects.equals(this.lastName, userResponse.lastName) &&
        Objects.equals(this.email, userResponse.email) &&
        Objects.equals(this.phoneNumber, userResponse.phoneNumber);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, firstName, lastName, email, phoneNumber);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UserResponse {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    firstName: ").append(toIndentedString(firstName)).append("\n");
    sb.append("    lastName: ").append(toIndentedString(lastName)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    phoneNumber: ").append(toIndentedString(phoneNumber)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(@Nullable Object o) {
    return o == null ? "null" : o.toString().replace("\n", "\n    ");
  }
}

