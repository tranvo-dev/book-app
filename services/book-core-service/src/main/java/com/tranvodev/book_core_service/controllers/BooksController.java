package com.tranvodev.book_core_service.controllers;

import com.tranvodev.book_core_service.api.BooksApi;
import com.tranvodev.book_core_service.security.CurrentUserProvider;
import com.tranvodev.book_core_service.services.BooksService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

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
        this.booksService.uploadAttachment(currentUserProvider.getAuthenticatedUser(), file);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<Resource> downloadBook(UUID bookId) {
        return BooksApi.super.downloadBook(bookId);
    }
}
