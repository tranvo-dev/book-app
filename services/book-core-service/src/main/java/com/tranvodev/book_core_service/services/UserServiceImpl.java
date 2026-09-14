package com.tranvodev.book_core_service.services;

import com.tranvodev.book_core_service.dtos.AuthenticatedUser;
import com.tranvodev.book_core_service.dtos.User;
import com.tranvodev.book_core_service.entities.UserEntity;
import com.tranvodev.book_core_service.mappers.UserMapper;
import com.tranvodev.book_core_service.repositories.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UsersRepository usersRepository;
    private final UserMapper userMapper;

    @Transactional
    @Override
    public User resolveCurrentUser(AuthenticatedUser authenticatedUser) {
        String sub = authenticatedUser.sub();
        String email = authenticatedUser.email();
        UserEntity possibleUser = usersRepository.findBySub(sub).orElseGet(() -> createNewUser(sub, email));
        return userMapper.toDto(possibleUser);
    }

    private UserEntity createNewUser(String sub, String email) {
        UserEntity newUser = new UserEntity();
        newUser.setSub(sub);
        newUser.setEmail(email);
        return usersRepository.save(newUser);
    }
}
