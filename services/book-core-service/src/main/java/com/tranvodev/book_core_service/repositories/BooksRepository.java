package com.tranvodev.book_core_service.repositories;

import com.tranvodev.book_core_service.entities.BookEntity;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;

public interface BooksRepository extends CrudRepository<BookEntity, UUID> {}
