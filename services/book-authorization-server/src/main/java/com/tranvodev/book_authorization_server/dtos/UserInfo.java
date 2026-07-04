package com.tranvodev.book_authorization_server.dtos;

import java.time.Instant;

public record UserInfo(String firstName, String lastName, String email, Instant memberSince) {
}
