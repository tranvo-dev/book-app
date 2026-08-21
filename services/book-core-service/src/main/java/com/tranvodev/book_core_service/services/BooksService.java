package com.tranvodev.book_core_service.services;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.multipart.MultipartFile;

public interface BooksService {
    void uploadAttachment(Jwt jwt, MultipartFile file);
}
