package com.tranvodev.book_core_service.services;

import com.tranvodev.book_core_service.dtos.AuthenticatedUser;
import com.tranvodev.book_core_service.dtos.User;

public interface UserService {
    User resolveCurrentUser(AuthenticatedUser authenticatedUser);
}
