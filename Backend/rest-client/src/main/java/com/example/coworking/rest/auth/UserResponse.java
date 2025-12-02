package com.example.coworking.rest.auth;

import com.example.coworking.rest.user.UserEntity;
import com.example.coworking.rest.user.UserRole;

import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private UserRole role;
    private LocalDateTime createdAt;

    public static UserResponse from(UserEntity e) {
        UserResponse r = new UserResponse();
        r.id = e.getId();
        r.name = e.getName();
        r.email = e.getEmail();
        r.phone = e.getPhone();
        r.role = e.getRole();
        r.createdAt = e.getCreatedAt();
        return r;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public UserRole getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
