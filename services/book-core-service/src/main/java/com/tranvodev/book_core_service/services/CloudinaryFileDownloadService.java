package com.tranvodev.book_core_service.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.tranvodev.book_core_service.exceptions.FileDownloadException;
import java.io.InputStream;
import java.net.URI;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class CloudinaryFileDownloadService {
    private final Cloudinary cloudinary;
    private final RestClient restClient = RestClient.create();

    public CloudinaryFileDownloadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public Resource download(String sub, String title) {
        String fileUrl;
        try {
            fileUrl = cloudinary.privateDownload(
                    String.format("%s/%s", sub, title),
                    "pdf",
                    ObjectUtils.asMap("resource_type", "image", "type", "upload"));

            return restClient
                    .get()
                    .uri(URI.create(fileUrl))
                    .exchange(
                            ((clientRequest, clientResponse) -> {
                                if (clientResponse.getStatusCode().is2xxSuccessful()) {
                                    // 1. Get the raw input stream from the external response body
                                    InputStream externalStream = clientResponse.getBody();

                                    // 2. Wrap it inside Spring's InputStreamResource
                                    return new InputStreamResource(externalStream);
                                } else {
                                    clientResponse.close();
                                    throw new FileDownloadException(
                                            "Failed to download file: " + clientResponse.getStatusCode(),
                                            clientResponse.getStatusCode());
                                }
                            }),
                            false); // keep the response open; the stream is closed after it's written to the client
        } catch (Exception e) {
            throw new FileDownloadException("Failed to open Cloudinary download stream", e);
        }
    }
}
