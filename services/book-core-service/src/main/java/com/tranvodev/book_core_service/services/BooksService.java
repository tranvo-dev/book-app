package com.tranvodev.book_core_service.services;

import org.springframework.web.multipart.MultipartFile;

public interface BooksService {
    public void uploadAttachment(MultipartFile file);
}
