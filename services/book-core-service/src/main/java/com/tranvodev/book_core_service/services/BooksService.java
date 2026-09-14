package com.tranvodev.book_core_service.services;

import com.tranvodev.book_core_service.dtos.AuthenticatedUser;
import org.springframework.web.multipart.MultipartFile;

public interface BooksService {
    void uploadAttachment(AuthenticatedUser authenticatedUser, MultipartFile file);
}
