package com.tranvodev.book_core_service.controllers;

import com.tranvodev.book_core_service.api.BooksApi;
import com.tranvodev.book_core_service.security.CurrentUserProvider;
import com.tranvodev.book_core_service.services.BooksService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class BooksController implements BooksApi {
    private final BooksService booksService;
    private final CurrentUserProvider currentUserProvider;

    public BooksController(BooksService booksService, CurrentUserProvider currentUserProvider) {
        this.booksService = booksService;
        this.currentUserProvider = currentUserProvider;
    }

    @Override
    public ResponseEntity<Void> uploadBook(MultipartFile file) {
        Jwt jwt = currentUserProvider.getUserJwt();
        this.booksService.uploadAttachment(jwt, file);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
