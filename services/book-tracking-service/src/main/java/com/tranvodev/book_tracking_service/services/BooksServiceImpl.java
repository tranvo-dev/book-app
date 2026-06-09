package com.tranvodev.book_tracking_service.services;

import com.google.cloud.storage.BlobInfo;
import com.tranvodev.book_tracking_service.entities.BookEntity;
import com.tranvodev.book_tracking_service.repositories.BooksRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class BooksServiceImpl implements BooksService {
    private final BooksRepository booksRepository;
    private final GcsUploadService gcsUploadService;

    public BooksServiceImpl(BooksRepository booksRepository, GcsUploadService gcsUploadService) {
        this.booksRepository = booksRepository;
        this.gcsUploadService = gcsUploadService;
    }

    @Override
    @Transactional
    public void addBook(MultipartFile file) {
        String userId = getUserId();
        BlobInfo uploadedBlobInfo = gcsUploadService.uploadFile(userId, file);
        saveBookInfo(userId, uploadedBlobInfo);
    }

    private void saveBookInfo(String userId, BlobInfo uploadedBlobInfo) {
        BookEntity book = new BookEntity();
        book.setTitle(uploadedBlobInfo.getBlobId().getName());
        book.setAttachmentId(uploadedBlobInfo.getGeneratedId());
        book.setUserId(userId);
        booksRepository.save(book);
    }

    private String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Ensure the principal type matches a decoded JWT
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt)) {
            throw new IllegalArgumentException("Invalid userId");
        }
        return ((Jwt) authentication.getPrincipal()).getSubject();
    }
}
