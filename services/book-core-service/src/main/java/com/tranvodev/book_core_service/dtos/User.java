package com.tranvodev.book_core_service.dtos;

import java.util.UUID;

/**
 * Internal representation of a user, decoupled from the OpenAPI egress DTO.
 * Used for cross-boundary logic within services.
 */
public record User(UUID id, String sub, String email, String firstName, String lastName, String phoneNumber) {}
