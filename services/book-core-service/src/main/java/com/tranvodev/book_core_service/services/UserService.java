package com.tranvodev.book_core_service.services;

import com.tranvodev.book_core_service.dtos.User;
import org.springframework.security.oauth2.jwt.Jwt;

public interface UserService {
    User resolveCurrentUser(Jwt jwt);
}
