package com.tranvodev.book_core_service.services;

import com.tranvodev.book_core_service.dto.UserResponse;
import org.springframework.security.oauth2.jwt.Jwt;

public interface UserService {
    UserResponse resolveCurrentUser(Jwt jwt);
}
