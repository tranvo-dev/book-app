package com.tranvodev.book_core_service.controllers;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTParser;
import com.tranvodev.book_core_service.api.UsersApi;
import com.tranvodev.book_core_service.dto.UserResponse;
import com.tranvodev.book_core_service.exceptions.UserTokenInvalidException;
import com.tranvodev.book_core_service.services.UserService;
import java.text.ParseException;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class UsersController implements UsersApi {
    private final UserService userService;

    @Override
    public ResponseEntity<UserResponse> getCurrentUser() {
        Jwt jwt =
                (Jwt) Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication())
                        .getPrincipal();
        return ResponseEntity.ok(userService.resolveCurrentUser(toNimbusJwt(Objects.requireNonNull(jwt))));
    }

    private JWT toNimbusJwt(Jwt jwt) {
        try {
            return JWTParser.parse(jwt.getTokenValue());
        } catch (ParseException parseException) {
            throw new UserTokenInvalidException("Given token is invalid");
        }
    }
}
