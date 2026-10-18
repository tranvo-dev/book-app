package com.tranvodev.book_core_service.mappers;

import com.tranvodev.book_core_service.dtos.Book;
import com.tranvodev.book_core_service.entities.BookEntity;
import com.tranvodev.book_core_service.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface BookMapper {
    BookMapper INSTANCE = Mappers.getMapper(BookMapper.class);

    @Mapping(source = "owner", target = "ownerId", qualifiedByName = "getOwnerSub")
    Book toDto(BookEntity entity);

    @Named("getOwnerSub")
    default String getOwnerSub(UserEntity owner) {
        return owner.getSub();
    }
}
