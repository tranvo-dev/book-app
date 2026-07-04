package com.tranvodev.book_core_service.services;

import com.google.cloud.storage.BlobInfo;
import com.tranvodev.book_core_service.entities.BookEntity;
import com.tranvodev.book_core_service.repositories.BooksRepository;
import jakarta.transaction.Transactional;
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
    public void uploadAttachment(MultipartFile file) {
        BlobInfo uploadedBlobInfo = gcsUploadService.uploadFile(file);
        BookEntity book = new BookEntity();
        book.setTitle(uploadedBlobInfo.getBlobId().getName());
        book.setAttachmentId(uploadedBlobInfo.getGeneratedId());
        booksRepository.save(book);
    }
}
