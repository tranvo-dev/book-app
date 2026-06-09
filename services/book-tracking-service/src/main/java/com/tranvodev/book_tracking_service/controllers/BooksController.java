package com.tranvodev.book_tracking_service.controllers;

import com.tranvodev.book_tracking_service.api.BooksApi;
import com.tranvodev.book_tracking_service.services.BooksServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class BooksController implements BooksApi {
    private final BooksServiceImpl booksService;

    public BooksController(BooksServiceImpl booksService) {
        this.booksService = booksService;
    }

    @Override
    public ResponseEntity<Void> uploadBook(MultipartFile file) {
        this.booksService.addBook(file);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
