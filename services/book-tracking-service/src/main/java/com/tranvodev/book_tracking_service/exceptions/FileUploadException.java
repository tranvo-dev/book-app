package com.tranvodev.book_tracking_service.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatusCode;

@Getter
public class FileUploadException extends RuntimeException {
    private HttpStatusCode statusCode;

    public FileUploadException(String message) {
        super(message);
    }

    public FileUploadException(String message, HttpStatusCode status) {
        super(message);
        this.statusCode = status;
    }

    public FileUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
