package com.tranvodev.book_authorization_server.services;

import com.tranvodev.book_authorization_server.dtos.requests.UserRegistrationRequest;
import com.tranvodev.book_authorization_server.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public @NonNull UserDetails loadUserByUsername(@NonNull String username) {
		return this.userRepository.findByEmail(username)
				.orElseThrow(() -> new UsernameNotFoundException("User does not exist"));
	}

	@Transactional
	public void register(UserRegistrationRequest request) {
		if (userRepository.findByEmail(request.email()).isPresent()) {
			throw new IllegalArgumentException("Email already in use");
		}
		com.tranvodev.book_authorization_server.entities.User user = new com.tranvodev.book_authorization_server.entities.User(
				request.firstName(), request.lastName(), request.email(),
				this.passwordEncoder.encode(request.password()));
		this.userRepository.save(user);
	}
}
