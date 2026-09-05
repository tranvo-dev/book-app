package com.tranvodev.book_core_service.security;

import com.tranvodev.book_core_service.dtos.AuthenticatedUser;
import com.tranvodev.book_core_service.exceptions.UserTokenInvalidException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserProvider {
    public AuthenticatedUser getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new UserTokenInvalidException("Invalid jwt token");
        }
        return new AuthenticatedUser(jwt.getSubject(), jwt.getClaimAsString("email"));
    }
}
