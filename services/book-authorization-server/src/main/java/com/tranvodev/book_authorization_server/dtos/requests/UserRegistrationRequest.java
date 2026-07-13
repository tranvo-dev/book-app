package com.tranvodev.book_authorization_server.dtos.requests;

import jakarta.validation.constraints.Min;
import lombok.NonNull;

public record UserRegistrationRequest(
        @NonNull String firstName, @NonNull String lastName, @NonNull String email, @NonNull @Min(8) String password) {}
