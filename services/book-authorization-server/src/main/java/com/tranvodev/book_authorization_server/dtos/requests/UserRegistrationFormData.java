package com.tranvodev.book_authorization_server.dtos.requests;

import lombok.NonNull;
import org.springframework.web.bind.annotation.RequestParam;

public record UserRegistrationFormData(@RequestParam @NonNull String firstName, @RequestParam @NonNull String lastName,
		@RequestParam @NonNull String email, @RequestParam @NonNull String password,
		@RequestParam @NonNull String confirmPassword) {
}
