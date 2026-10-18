package com.tranvodev.book_core_service.configs;

import com.cloudinary.Cloudinary;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Value("${cloudinary.cloud-name}")
    String cloudName;

    @Value("${cloudinary.api-key}")
    String key;

    @Value("${cloudinary.api-secret}")
    String secret;

    @Bean
    public Cloudinary config() {
        HashMap<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", key);
        config.put("api_secret", secret);
        return new Cloudinary(config);
    }
}
