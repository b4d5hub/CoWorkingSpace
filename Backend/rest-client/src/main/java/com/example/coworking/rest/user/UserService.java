package com.example.coworking.rest.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public UserEntity register(String name, String email, String rawPassword) {
        return register(name, email, rawPassword, null);
    }

    @Transactional
    public UserEntity register(String name, String email, String rawPassword, String phone) {
        UserEntity entity = new UserEntity();
        entity.setName(name);
        entity.setEmail(email);
        entity.setPasswordHash(passwordEncoder.encode(rawPassword));
        if (phone != null && !phone.trim().isEmpty()) {
            entity.setPhone(phone.trim());
        }
        entity.setRole(UserRole.USER);
        return userRepository.save(entity);
    }

    public UserEntity authenticate(String email, String rawPassword) {
        return userRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(rawPassword, u.getPasswordHash()))
                .orElse(null);
    }
}
