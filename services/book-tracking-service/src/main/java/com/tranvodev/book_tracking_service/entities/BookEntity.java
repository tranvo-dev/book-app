package com.tranvodev.book_tracking_service.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity(name = "books")
public class BookEntity extends BaseEntity {
    @Column
    private String title;

    @Column(name = "attachment_id")
    private String attachmentId;

    @Column(name = "file_hash", unique = true)
    private String fileHash;
}
