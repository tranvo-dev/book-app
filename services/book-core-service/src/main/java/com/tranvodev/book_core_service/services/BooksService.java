package com.tranvodev.book_core_service.services;

import com.tranvodev.book_core_service.dtos.AuthenticatedUser;
import com.tranvodev.book_core_service.dtos.Book;
import com.tranvodev.book_core_service.dtos.User;
import com.tranvodev.book_core_service.entities.BookEntity;
import com.tranvodev.book_core_service.entities.UserEntity;
import com.tranvodev.book_core_service.exceptions.FileDownloadException;
import com.tranvodev.book_core_service.mappers.BookMapper;
import com.tranvodev.book_core_service.repositories.BooksRepository;
import com.tranvodev.book_core_service.repositories.UsersRepository;
import jakarta.transaction.Transactional;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import org.apache.commons.lang3.Strings;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class BooksService {
    private final BooksRepository booksRepository;
    private final UsersRepository usersRepository;
    private final UserService userService;
    private final CloudinaryFileUploadService cloudinaryFileUploadService;
    private final CloudinaryFileDownloadService cloudinaryFileDownloadService;

    public BooksService(
            BooksRepository booksRepository,
            UsersRepository usersRepository,
            UserService userService,
            CloudinaryFileUploadService cloudinaryFileUploadService,
            CloudinaryFileDownloadService cloudinaryFileDownloadService) {
        this.booksRepository = booksRepository;
        this.usersRepository = usersRepository;
        this.userService = userService;
        this.cloudinaryFileUploadService = cloudinaryFileUploadService;
        this.cloudinaryFileDownloadService = cloudinaryFileDownloadService;
    }

    @Transactional
    public void uploadAttachment(AuthenticatedUser authenticatedUser, MultipartFile file) {
        User user = userService.getUserInfo(authenticatedUser);
        Map uploaded = cloudinaryFileUploadService.upload(user.sub(), file);

        // getReferenceById produces only JPA reference not the entire data
        // Only use getReferenceById when user.id is ensured to be existed
        UserEntity owner = usersRepository.getReferenceById(user.id());

        BookEntity book = new BookEntity();
        book.setTitle(uploaded.get("display_name").toString());
        book.setAttachmentId(uploaded.get("asset_id").toString());
        book.setOwner(owner);
        booksRepository.save(book);
    }

    public Resource downloadAttachment(AuthenticatedUser authenticatedUser, UUID id) {
        User user = userService.getUserInfo(authenticatedUser);
        Book book = findBookById(id.toString());
        String bookTitle = book.title();
        if (Strings.CS.compare(user.sub(), book.ownerId()) != 0) {
            throw new FileDownloadException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        return cloudinaryFileDownloadService.download(user.sub(), bookTitle);
    }

    public Book findBookById(String id) {
        Optional<BookEntity> book = booksRepository.findById(UUID.fromString(id));
        if (book.isEmpty()) throw new NoSuchElementException("Book with id " + id + " not found");
        return BookMapper.INSTANCE.toDto(book.get());
    }
}
