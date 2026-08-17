package com.tranvodev.book_core_service.services;

import com.nimbusds.jwt.JWT;
import com.tranvodev.book_core_service.dto.UserResponse;

public interface UserService {
    UserResponse resolveCurrentUser(JWT jwt);
}
