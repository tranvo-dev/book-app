package com.tranvodev.book_core_service.services;

import com.tranvodev.book_core_service.dtos.AuthenticatedUser;
import com.tranvodev.book_core_service.dtos.User;
import com.tranvodev.book_core_service.entities.UserEntity;
import com.tranvodev.book_core_service.exceptions.UserException;
import com.tranvodev.book_core_service.mappers.UserMapper;
import com.tranvodev.book_core_service.repositories.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UsersRepository usersRepository;
    private final UserMapper userMapper;

    /**
     * Strict lookup for business flows (upload, download, ...). Never creates a user: callers
     * must already be provisioned via {@link #getOrCreateUser(AuthenticatedUser)}.
     */
    public User getUserInfo(AuthenticatedUser authenticatedUser) {
        return usersRepository
                .findBySub(authenticatedUser.sub())
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserException("User not found"));
    }

    /**
     * Provisioning lookup for the first call after a user registers/logs in on the auth server.
     * Returns the existing user, or creates it from the token claims if it does not exist yet.
     */
    public User getOrCreateUser(AuthenticatedUser authenticatedUser) {
        return usersRepository
                .findBySub(authenticatedUser.sub())
                .map(userMapper::toDto)
                .orElseGet(() -> createNewUser(authenticatedUser));
    }

    private User createNewUser(AuthenticatedUser authenticatedUser) {
        if (authenticatedUser.email() == null || authenticatedUser.email().isBlank()) {
            throw new UserException("Token is missing the email claim");
        }

        UserEntity newUser = new UserEntity();
        newUser.setSub(authenticatedUser.sub());
        newUser.setEmail(authenticatedUser.email());
        try {
            // saveAndFlush runs in its own repository transaction so a unique(sub) violation
            // surfaces here instead of at commit time
            return userMapper.toDto(usersRepository.saveAndFlush(newUser));
        } catch (DataIntegrityViolationException e) {
            // A concurrent request provisioned the same sub first; return that row
            return usersRepository
                    .findBySub(authenticatedUser.sub())
                    .map(userMapper::toDto)
                    .orElseThrow(() -> e);
        }
    }
}
