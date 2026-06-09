package com.tranvodev.book_tracking_service.services;

import org.springframework.web.multipart.MultipartFile;

public interface BooksService {
    public void addBook(MultipartFile file);
}
