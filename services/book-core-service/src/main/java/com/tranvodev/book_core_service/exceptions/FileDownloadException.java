package com.tranvodev.book_core_service.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatusCode;

@Getter
public class FileDownloadException extends RuntimeException {
    private HttpStatusCode statusCode;

    public FileDownloadException(String message, HttpStatusCode status) {
        super(message);
        this.statusCode = status;
    }

    public FileDownloadException(String message, Throwable cause) {
        super(message, cause);
    }
}
