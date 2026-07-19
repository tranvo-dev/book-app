package com.tranvodev.book_authorization_server.mappers;

import com.tranvodev.book_authorization_server.dtos.UserInfo;
import com.tranvodev.book_authorization_server.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "memberSince", source = "createdAt")
    UserInfo toUserInfo(User user);
}
