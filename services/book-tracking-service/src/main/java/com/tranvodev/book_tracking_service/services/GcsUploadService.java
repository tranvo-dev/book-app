package com.tranvodev.book_tracking_service.services;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.tranvodev.book_tracking_service.exceptions.FileUploadException;
import java.io.IOException;
import java.util.List;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class GcsUploadService {
    private static final List<String> ALLOWED_TYPES = List.of("application/pdf");
    private final Logger logger = LoggerFactory.getLogger(GcsUploadService.class);
    private final Storage storage;
    private final String bucketName;
    private final Tika tika = new Tika();

    public GcsUploadService(Storage storage, @Value("${gcs.bucket-name}") String bucketName) {
        this.storage = storage;
        this.bucketName = bucketName;
    }

    public BlobInfo uploadFile(String userId, MultipartFile file) {
        String fileName = String.format("%s/%s_%d", userId, file.getOriginalFilename(), System.currentTimeMillis());
        try {
            String extractedFileType = extrackMimeType(file);
            if (!isAllowedToUpload(extractedFileType)) {
                throw new FileUploadException(
                        String.format("Not allowed file type: %s", extractedFileType), HttpStatus.BAD_REQUEST);
            }

            BlobInfo blobInfo = getBlobInfo(file, fileName, extractedFileType);
            return storage.create(blobInfo, file.getBytes());
        } catch (IOException e) {
            logger.error(String.format("[GcsUploadService] Failed to upload file %s", fileName), e);
            throw new FileUploadException("Failed to upload the file.", e);
        }
    }

    private String extrackMimeType(MultipartFile file) throws IOException {
        return tika.detect(file.getInputStream());
    }

    private boolean isAllowedToUpload(String mimeType) {
        return ALLOWED_TYPES.contains(mimeType);
    }

    private BlobInfo getBlobInfo(MultipartFile file, String fileName, String mimeType) {
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(mimeType).build();
        return blobInfo;
    }
}
