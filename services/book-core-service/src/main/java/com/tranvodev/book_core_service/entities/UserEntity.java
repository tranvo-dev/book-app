package com.tranvodev.book_core_service.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity(name = "users")
public class UserEntity extends BaseEntity {
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
    private static final String PHONE_PATTERN = "^[+\\s()0-9.-]{7,20}$";

    @Column(nullable = false, unique = true)
    private String sub;

    @Column(name = "email", nullable = false)
    @Pattern(regexp = EMAIL_PATTERN, message = "Please provide a valid email address")
    private String email;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone_number")
    @Pattern(regexp = PHONE_PATTERN, message = "Please provide a valid phone number")
    private String phoneNumber;

    @OneToMany(orphanRemoval = true, cascade = CascadeType.REMOVE, mappedBy = "owner", fetch = FetchType.LAZY)
    List<BookEntity> books;
}
