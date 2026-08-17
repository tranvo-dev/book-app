package com.tranvodev.book_core_service.exceptions;

public sealed class UserException extends RuntimeException permits UserTokenInvalidException {
    public UserException(String message) {
        super(message);
    }
}
