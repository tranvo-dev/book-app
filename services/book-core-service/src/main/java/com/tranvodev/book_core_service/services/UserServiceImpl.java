package com.tranvodev.book_core_service.services;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.tranvodev.book_core_service.dto.UserResponse;
import com.tranvodev.book_core_service.entities.UserEntity;
import com.tranvodev.book_core_service.exceptions.UserTokenInvalidException;
import com.tranvodev.book_core_service.mappers.UserMapper;
import com.tranvodev.book_core_service.repositories.UsersRepository;
import jakarta.transaction.Transactional;
import java.text.ParseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UsersRepository usersRepository;
    private final UserMapper userMapper;

    @Transactional
    @Override
    public UserResponse resolveCurrentUser(JWT jwt) {
        try {
            JWTClaimsSet jwtClaimsSet = jwt.getJWTClaimsSet();
            String sub = jwtClaimsSet.getSubject();
            String email = jwtClaimsSet.getClaimAsString("email");

            UserEntity possibleUser = usersRepository.findBySub(sub).orElseGet(() -> createNewUser(sub, email));

            return userMapper.toResponse(possibleUser);
        } catch (ParseException parseException) {
            throw new UserTokenInvalidException("Given token is invalid");
        }
    }

    private UserEntity createNewUser(String sub, String email) {
        UserEntity newUser = new UserEntity();
        newUser.setSub(sub);
        newUser.setEmail(email);
        return usersRepository.save(newUser);
    }
}
