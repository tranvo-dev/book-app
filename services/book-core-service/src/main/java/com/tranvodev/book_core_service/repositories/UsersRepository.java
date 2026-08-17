package com.tranvodev.book_core_service.repositories;

import com.tranvodev.book_core_service.entities.UserEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findBySub(String sub);
}
