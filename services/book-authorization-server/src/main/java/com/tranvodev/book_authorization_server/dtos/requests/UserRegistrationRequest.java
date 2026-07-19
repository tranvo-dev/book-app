package com.tranvodev.book_authorization_server.dtos.requests;

public record UserRegistrationRequest(
        String firstName, String lastName, String email, String password) {}
