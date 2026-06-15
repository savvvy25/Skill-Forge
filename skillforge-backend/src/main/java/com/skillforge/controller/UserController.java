package com.skillforge.controller;

import com.skillforge.dto.ApiResponse;
import com.skillforge.dto.ProfileUpdateRequest;
import com.skillforge.dto.UserDTO;
import com.skillforge.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * GET /api/user/profile
     * Returns the authenticated user's profile.
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(Authentication authentication) {
        Long userId = extractUserId(authentication);
        UserDTO userDTO = userService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", userDTO));
    }

    /**
     * PUT /api/user/profile
     * Updates the authenticated user's profile.
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(Authentication authentication,
                                                               @RequestBody ProfileUpdateRequest request) {
        Long userId = extractUserId(authentication);
        UserDTO updatedUser = userService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
    }

    /**
     * Extracts the user ID from the JWT-authenticated principal.
     * The principal username stores the user ID (set in CustomUserDetailsService).
     */
    private Long extractUserId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }
}
