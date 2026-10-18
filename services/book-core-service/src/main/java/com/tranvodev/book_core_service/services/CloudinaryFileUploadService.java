package com.tranvodev.book_core_service.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CloudinaryFileUploadService {
    private final Cloudinary cloudinary;

    public CloudinaryFileUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public Map upload(String sub, MultipartFile file) {
        try {
            // Uploads the file and returns meta-information (including URL)
            return this.cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", sub));
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Cloudinary", e);
        }
    }
}
