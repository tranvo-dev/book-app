package com.tranvodev.book_core_service.controllers;

import com.tranvodev.book_core_service.api.UsersApi;
import com.tranvodev.book_core_service.dto.UserResponse;
import com.tranvodev.book_core_service.security.CurrentUserProvider;
import com.tranvodev.book_core_service.services.UserService;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class UsersController implements UsersApi {
    private final UserService userService;
    private final CurrentUserProvider currentUserProvider;

    @Override
    public ResponseEntity<UserResponse> getCurrentUser() {
        Jwt jwt = currentUserProvider.getUserJwt();
        return ResponseEntity.ok(userService.resolveCurrentUser(Objects.requireNonNull(jwt)));
    }
}
