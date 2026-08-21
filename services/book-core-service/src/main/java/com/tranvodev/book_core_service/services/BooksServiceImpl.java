package com.tranvodev.book_core_service.services;

import com.google.cloud.storage.BlobInfo;
import com.tranvodev.book_core_service.dtos.AuthenticatedUser;
import com.tranvodev.book_core_service.dtos.User;
import com.tranvodev.book_core_service.entities.BookEntity;
import com.tranvodev.book_core_service.entities.UserEntity;
import com.tranvodev.book_core_service.repositories.BooksRepository;
import com.tranvodev.book_core_service.repositories.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class BooksServiceImpl implements BooksService {
    private final BooksRepository booksRepository;
    private final UsersRepository usersRepository;
    private final UserService userService;
    private final GcsUploadService gcsUploadService;

    public BooksServiceImpl(
            BooksRepository booksRepository,
            UsersRepository usersRepository,
            UserService userService,
            GcsUploadService gcsUploadService) {
        this.booksRepository = booksRepository;
        this.usersRepository = usersRepository;
        this.userService = userService;
        this.gcsUploadService = gcsUploadService;
    }

    @Override
    @Transactional
    public void uploadAttachment(AuthenticatedUser authenticatedUser, MultipartFile file) {
        User user = userService.resolveCurrentUser(authenticatedUser);
        BlobInfo uploadedBlobInfo = gcsUploadService.uploadFile(user.sub(), file);

        // getReferenceById produces only JPA reference not the entire data
        // Only use getReferenceById when user.id is ensured to be existed
        UserEntity owner = usersRepository.getReferenceById(user.id());

        BookEntity book = new BookEntity();
        book.setTitle(uploadedBlobInfo.getBlobId().getName());
        book.setAttachmentId(uploadedBlobInfo.getGeneratedId());
        book.setOwner(owner);
        booksRepository.save(book);
    }
}
