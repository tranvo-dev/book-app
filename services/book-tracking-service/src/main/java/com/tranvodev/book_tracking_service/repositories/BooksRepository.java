package com.tranvodev.book_tracking_service.repositories;

import com.tranvodev.book_tracking_service.entities.BookEntity;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BooksRepository extends CrudRepository<BookEntity, UUID> {}
