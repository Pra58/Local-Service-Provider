package com.Backend.Backend.service;

import com.Backend.Backend.dto.UserResponse;
import com.Backend.Backend.dto.UserRoleUpdateRequest;
import com.Backend.Backend.dto.UserUpdateRequest;
import com.Backend.Backend.entity.RoleType;
import com.Backend.Backend.entity.User;
import com.Backend.Backend.exception.BadRequestException;
import com.Backend.Backend.exception.ResourceNotFoundException;
import com.Backend.Backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getUserResponse(Long id) {
        return new UserResponse(getUserOrThrow(id));
    }

    public User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public UserResponse updateCurrentUser(User currentUser, UserUpdateRequest request) {
        User user = getUserOrThrow(currentUser.getId());

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return new UserResponse(userRepository.save(user));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getAllProviders() {
        return userRepository.findByRole(RoleType.PROVIDER).stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUserRole(Long userId, UserRoleUpdateRequest request) {
        User user = getUserOrThrow(userId);

        RoleType newRole;
        try {
            newRole = RoleType.valueOf(request.getRole().trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Role must be one of: CUSTOMER, PROVIDER, ADMIN");
        }

        user.setRole(newRole);
        return new UserResponse(userRepository.save(user));
    }
}
