package com.skillforge.service;

import com.skillforge.dto.ProfileUpdateRequest;
import com.skillforge.dto.UserDTO;
import com.skillforge.entity.User;
import com.skillforge.exception.ResourceNotFoundException;
import com.skillforge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves the profile of the user with the given ID.
     */
    @Transactional(readOnly = true)
    public UserDTO getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToUserDTO(user);
    }

    /**
     * Updates the profile of the user with the given ID.
     * Only updates fields that are provided (non-null).
     */
    @Transactional
    public UserDTO updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getBranch() != null) {
            user.setBranch(request.getBranch());
        }
        if (request.getGraduationYear() != null) {
            user.setGraduationYear(request.getGraduationYear());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserDTO(updatedUser);
    }

    /**
     * Maps a User entity to a UserDTO (excludes sensitive fields).
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
