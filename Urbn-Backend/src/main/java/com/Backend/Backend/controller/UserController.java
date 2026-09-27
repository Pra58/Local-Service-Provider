package com.Backend.Backend.controller;

import com.Backend.Backend.dto.UserResponse;
import com.Backend.Backend.dto.UserUpdateRequest;
import com.Backend.Backend.entity.User;
import com.Backend.Backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(@AuthenticationPrincipal User currentUser) {
        return userService.getUserResponse(currentUser.getId());
    }

    @PutMapping("/me")
    public UserResponse updateCurrentUser(@AuthenticationPrincipal User currentUser,
                                           @Valid @RequestBody UserUpdateRequest request) {
        return userService.updateCurrentUser(currentUser, request);
    }

    @GetMapping("/providers")
    public java.util.List<UserResponse> getProviders() {
        return userService.getAllProviders();
    }
}
