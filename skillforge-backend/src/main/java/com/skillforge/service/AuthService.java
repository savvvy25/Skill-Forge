package com.skillforge.service;

import com.skillforge.dto.ApiResponse;
import com.skillforge.dto.AuthResponse;
import com.skillforge.dto.LoginRequest;
import com.skillforge.dto.RegisterRequest;
import com.skillforge.dto.UserDTO;
import com.skillforge.entity.User;
import com.skillforge.exception.DuplicateEmailException;
import com.skillforge.exception.InvalidCredentialsException;
import com.skillforge.repository.UserRepository;
import com.skillforge.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Registers a new user account.
     * Checks for duplicate email, hashes the password, and persists the user.
     */
    @Transactional
    public ApiResponse<UserDTO> register(RegisterRequest request) {
        // Check if an account with this email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(
                    "An account with email '" + request.getEmail() + "' already exists");
        }

        // Build and save the new user with BCrypt-hashed password
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .branch(request.getBranch())
                .graduationYear(request.getGraduationYear())
                .build();

        User savedUser = userRepository.save(user);

        UserDTO userDTO = mapToUserDTO(savedUser);
        return ApiResponse.success("User registered successfully", userDTO);
    }

    /**
     * Authenticates a user by email and password.
     * On success, generates and returns a JWT token along with user details.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Find the user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        // Verify the provided password against the stored hash
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());

        // Build and return the auth response
        UserDTO userDTO = mapToUserDTO(user);
        return AuthResponse.builder()
                .token(token)
                .user(userDTO)
                .build();
    }

    /**
     * Maps a User entity to a UserDTO (excludes password).
     */
    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .branch(user.getBranch())
                .graduationYear(user.getGraduationYear())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
