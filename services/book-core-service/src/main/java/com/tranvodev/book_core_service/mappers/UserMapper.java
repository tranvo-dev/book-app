package com.tranvodev.book_core_service.mappers;

import com.tranvodev.book_core_service.dto.UserResponse;
import com.tranvodev.book_core_service.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface UserMapper {

    // Map Database Entity to outgoing OpenAPI Response DTO
    UserResponse toResponse(UserEntity entity);
}
