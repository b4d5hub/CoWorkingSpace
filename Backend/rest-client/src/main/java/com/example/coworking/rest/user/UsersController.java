package com.example.coworking.rest.user;

import com.example.coworking.rest.auth.UserResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UsersController {

    private final UserRepository userRepository;
    private final UserService userService;

    public UsersController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> list() {
        return userRepository.findAll().stream().map(UserResponse::from).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> get(@PathVariable("id") Long id) {
        return userRepository.findById(id)
                .map(UserResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    public static class UpdateUserRequest {
        public String name;
        public String email;
        public String phone;
        public UserRole role; // USER | ADMIN
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable("id") Long id, @RequestBody UpdateUserRequest req) {
        return userRepository.findById(id)
                .map(u -> {
                    // Handle email update with uniqueness check
                    if (req.email != null) {
                        String newEmail = req.email.trim();
                        if (!newEmail.equalsIgnoreCase(u.getEmail())) {
                            boolean exists = userRepository.existsByEmail(newEmail);
                            if (exists) {
                                // Signal conflict by throwing and handling below
                                throw new EmailConflictException();
                            }
                            u.setEmail(newEmail);
                        }
                    }
                    if (req.name != null) u.setName(req.name);
                    if (req.phone != null) u.setPhone(req.phone);
                    if (req.role != null) u.setRole(req.role);
                    return userRepository.save(u);
                })
                .map(saved -> ResponseEntity.ok(UserResponse.from(saved)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    private static class EmailConflictException extends RuntimeException {}

    public static class ChangePasswordRequest {
        @NotBlank
        public String oldPassword;
        @NotBlank
        public String newPassword;
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<Void> changePassword(@PathVariable("id") Long id,
                                               @Valid @RequestBody ChangePasswordRequest req) {
        boolean changed = userService.changePassword(id, req.oldPassword, req.newPassword);
        if (!changed) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/promote")
    public ResponseEntity<UserResponse> promote(@PathVariable("id") Long id) {
        return userRepository.findById(id).map(u -> {
            u.setRole(UserRole.ADMIN);
            u = userRepository.save(u);
            return ResponseEntity.ok(UserResponse.from(u));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/{id}/demote")
    public ResponseEntity<UserResponse> demote(@PathVariable("id") Long id) {
        return userRepository.findById(id).map(u -> {
            u.setRole(UserRole.USER);
            u = userRepository.save(u);
            return ResponseEntity.ok(UserResponse.from(u));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
