package com.tranvodev.book_core_service.dtos;

import java.time.Instant;
import java.util.UUID;

public record Book(UUID id, String title, String attachmentId, String ownerId, Instant createdAt, Instant updatedAt) {}
