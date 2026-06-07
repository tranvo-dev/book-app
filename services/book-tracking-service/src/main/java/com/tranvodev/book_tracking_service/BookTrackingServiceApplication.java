package com.tranvodev.book_tracking_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class BookTrackingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookTrackingServiceApplication.class, args);
    }
}
