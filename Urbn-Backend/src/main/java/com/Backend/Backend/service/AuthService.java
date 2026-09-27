package com.Backend.Backend.service;

import com.Backend.Backend.dto.AuthResponse;
import com.Backend.Backend.dto.LoginRequest;
import com.Backend.Backend.dto.RegisterRequest;
import com.Backend.Backend.entity.RoleType;
import com.Backend.Backend.entity.User;
import com.Backend.Backend.exception.DuplicateResourceException;
import com.Backend.Backend.exception.UnauthorizedException;
import com.Backend.Backend.repository.UserRepository;
import com.Backend.Backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        RoleType role = resolvePublicRole(request.getRole());

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(role);

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved);

        return new AuthResponse(token, saved.getId(), saved.getName(), saved.getEmail(), saved.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    /**
     * Registration is public, so ADMIN can never be self-assigned here -
     * only CUSTOMER (default) or PROVIDER. Admin accounts must be created/
     * promoted by an existing admin via the user-management endpoints.
     */
    private RoleType resolvePublicRole(String requestedRole) {
        if (requestedRole == null || requestedRole.isBlank()) {
            return RoleType.CUSTOMER;
        }
        RoleType parsed;
        try {
            parsed = RoleType.valueOf(requestedRole.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new com.Backend.Backend.exception.BadRequestException(
                    "Role must be one of: CUSTOMER, PROVIDER");
        }
        if (parsed == RoleType.ADMIN) {
            throw new com.Backend.Backend.exception.BadRequestException(
                    "The ADMIN role cannot be self-assigned during registration");
        }
        return parsed;
    }
}
