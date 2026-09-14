package com.tranvodev.book_core_service.configs;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Logs the inbound {@code Authorization: Bearer} token for debugging.
 *
 * <p>WARNING: prints the full access token (a live credential). Enabled only under the {@code local}
 * profile. Never enable in dev/prod, and scrub logs after use.
 */
@Component
@Profile("local")
public class BearerLoggingFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(BearerLoggingFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            log.debug("{} {} -> Authorization: {}", request.getMethod(), request.getRequestURI(), authHeader);
        }
        filterChain.doFilter(request, response);
    }
}
