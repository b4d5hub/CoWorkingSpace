package com.example.coworking.rest.config;

import com.example.coworking.rest.user.UserEntity;
import com.example.coworking.rest.user.UserRepository;
import com.example.coworking.rest.user.UserRole;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner ensureDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            final String adminEmail = "admin@cowork.com";
            if (userRepository.existsByEmail(adminEmail)) {
                log.info("[INIT] Admin user already exists: {}", adminEmail);
                return;
            }
            UserEntity admin = new UserEntity();
            admin.setName("Admin User");
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);
            userRepository.save(admin);
            log.info("[INIT] Created default admin user: {} (password: admin123)", adminEmail);
        };
    }
}
