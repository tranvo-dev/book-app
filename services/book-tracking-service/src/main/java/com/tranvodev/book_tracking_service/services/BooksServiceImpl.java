package com.tranvodev.book_tracking_service.services;

import com.google.cloud.storage.BlobInfo;
import com.tranvodev.book_tracking_service.entities.BookEntity;
import com.tranvodev.book_tracking_service.exceptions.FileUploadException;
import com.tranvodev.book_tracking_service.repositories.BooksRepository;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import org.springframework.http.HttpStatus;
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
        String fileHash = computeSha256(file);
        if (booksRepository.findByFileHash(fileHash).isPresent()) {
            throw new FileUploadException("Duplicated content", HttpStatus.BAD_REQUEST);
        }
        BlobInfo uploadedBlobInfo = gcsUploadService.uploadFile(file);
        BookEntity book = new BookEntity();
        book.setTitle(uploadedBlobInfo.getBlobId().getName());
        book.setAttachmentId(uploadedBlobInfo.getGeneratedId());
        book.setFileHash(fileHash);
        booksRepository.save(book);
    }

    private String computeSha256(MultipartFile file) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            try (DigestInputStream dis = new DigestInputStream(file.getInputStream(), digest)) {
                dis.transferTo(java.io.OutputStream.nullOutputStream());
            }
            return HexFormat.of().formatHex(digest.digest());
        } catch (NoSuchAlgorithmException | IOException e) {
            throw new FileUploadException("Failed to compute file hash", e);
        }
    }
}
