package com.tranvodev.book_authorization_server.controllers;

import com.tranvodev.book_authorization_server.dtos.requests.UserRegistrationFormData;
import com.tranvodev.book_authorization_server.dtos.requests.UserRegistrationRequest;
import com.tranvodev.book_authorization_server.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.util.UriComponentsBuilder;

@Controller
@RequiredArgsConstructor
public class RegistrationController {

    private final UserService userService;

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @PostMapping("/register")
    public String register(UserRegistrationFormData formData) {
        if (!StringUtils.hasText(formData.firstName())
                || !StringUtils.hasText(formData.lastName())
                || !StringUtils.hasText(formData.email())
                || !StringUtils.hasText(formData.password())) {
            return redirectWithError("missing", formData.email());
        }
        if (formData.password().length() < 8) {
            return redirectWithError("password_length", formData.email());
        }
        if (!formData.password().equals(formData.confirmPassword())) {
            return redirectWithError("password_mismatch", formData.email());
        }

        try {
            userService.register(new UserRegistrationRequest(
                    formData.firstName(), formData.lastName(), formData.email(), formData.password()));
        } catch (DataIntegrityViolationException | IllegalArgumentException ex) {
            // Handle concurrent registration requests for 2 same emails
            // findByEmail then save — two concurrent registers both pass check
            // DB unique constrain catches, but it throws DataIntegrityViolationException instead of
            // IllegalArgumentException
            return redirectWithError("email_taken", formData.email());
        }

        return "redirect:/login?registered";
    }

    private String redirectWithError(String error, String email) {
        String url = UriComponentsBuilder.fromPath("/register")
                .queryParam("error", error)
                .queryParam("email", email == null ? "" : email)
                .build()
                .encode()
                .toUriString();
        return "redirect:" + url;
    }
}
