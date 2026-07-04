package com.tranvodev.book_core_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class BookCoreServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookCoreServiceApplication.class, args);
    }
}
