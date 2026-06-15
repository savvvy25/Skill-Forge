package com.skillforge.service;

import com.skillforge.dto.DashboardSummary;
import com.skillforge.dto.ProgressRequest;
import com.skillforge.dto.ProgressResponse;
import com.skillforge.entity.DsaProgress;
import com.skillforge.entity.User;
import com.skillforge.exception.ResourceNotFoundException;
import com.skillforge.repository.DsaProgressRepository;
import com.skillforge.repository.UserRepository;
import com.skillforge.util.DsaTopics;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    private final DsaProgressRepository dsaProgressRepository;
    private final UserRepository userRepository;

    public ProgressService(DsaProgressRepository dsaProgressRepository,
                           UserRepository userRepository) {
        this.dsaProgressRepository = dsaProgressRepository;
        this.userRepository = userRepository;
    }

    /**
     * Adds or updates DSA progress for a specific topic.
     * If the topic already exists for the user, it is updated instead of creating a duplicate.
     */
    @Transactional
    public ProgressResponse addProgress(Long userId, ProgressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Check if the user already has progress for this topic — update if so
        Optional<DsaProgress> existingProgress =
                dsaProgressRepository.findByUserIdAndTopic(userId, request.getTopic());

        DsaProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            progress.setEasyCount(request.getEasyCount() != null ? request.getEasyCount() : 0);
            progress.setMediumCount(request.getMediumCount() != null ? request.getMediumCount() : 0);
            progress.setHardCount(request.getHardCount() != null ? request.getHardCount() : 0);
        } else {
            progress = DsaProgress.builder()
                    .user(user)
                    .topic(request.getTopic())
                    .easyCount(request.getEasyCount() != null ? request.getEasyCount() : 0)
                    .mediumCount(request.getMediumCount() != null ? request.getMediumCount() : 0)
                    .hardCount(request.getHardCount() != null ? request.getHardCount() : 0)
                    .build();
        }

        DsaProgress saved = dsaProgressRepository.save(progress);
        return mapToProgressResponse(saved);
    }

    /**
     * Retrieves all DSA progress entries for a user.
     */
    @Transactional(readOnly = true)
    public List<ProgressResponse> getAllProgress(Long userId) {
        List<DsaProgress> progressList = dsaProgressRepository.findByUserId(userId);
        return progressList.stream()
                .map(this::mapToProgressResponse)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing DSA progress entry.
     */
    @Transactional
    public ProgressResponse updateProgress(Long userId, Long progressId, ProgressRequest request) {
        DsaProgress progress = dsaProgressRepository.findByIdAndUserId(progressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Progress", "id", progressId));

        progress.setTopic(request.getTopic());
        progress.setEasyCount(request.getEasyCount() != null ? request.getEasyCount() : 0);
        progress.setMediumCount(request.getMediumCount() != null ? request.getMediumCount() : 0);
        progress.setHardCount(request.getHardCount() != null ? request.getHardCount() : 0);

        DsaProgress updated = dsaProgressRepository.save(progress);
        return mapToProgressResponse(updated);
    }

    /**
     * Deletes a DSA progress entry belonging to the user.
     */
    @Transactional
    public void deleteProgress(Long userId, Long progressId) {
        DsaProgress progress = dsaProgressRepository.findByIdAndUserId(progressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Progress", "id", progressId));
        dsaProgressRepository.delete(progress);
    }

    /**
     * Calculates a dashboard summary aggregating progress across all topics.
     * Completion percentage is based on 17 total DSA topics.
     */
    @Transactional(readOnly = true)
    public DashboardSummary getDashboardSummary(Long userId) {
        List<DsaProgress> progressList = dsaProgressRepository.findByUserId(userId);

        int totalEasy = 0;
        int totalMedium = 0;
        int totalHard = 0;

        for (DsaProgress progress : progressList) {
            totalEasy += progress.getEasyCount();
            totalMedium += progress.getMediumCount();
            totalHard += progress.getHardCount();
        }

        int totalSolved = totalEasy + totalMedium + totalHard;
        int topicsCovered = progressList.size();

        // Completion percentage: topics with at least one solved problem / total DSA topics
        double completionPercentage = (topicsCovered * 100.0) / DsaTopics.TOTAL_TOPICS;
        // Round to two decimal places
        completionPercentage = Math.round(completionPercentage * 100.0) / 100.0;

        return DashboardSummary.builder()
                .totalSolved(totalSolved)
                .easySolved(totalEasy)
                .mediumSolved(totalMedium)
                .hardSolved(totalHard)
                .topicsCovered(topicsCovered)
                .completionPercentage(completionPercentage)
                .build();
    }

    /**
     * Maps a DsaProgress entity to a ProgressResponse DTO.
     */
    private ProgressResponse mapToProgressResponse(DsaProgress progress) {
        return ProgressResponse.builder()
                .id(progress.getId())
                .topic(progress.getTopic())
                .easyCount(progress.getEasyCount())
                .mediumCount(progress.getMediumCount())
                .hardCount(progress.getHardCount())
                .createdAt(progress.getCreatedAt())
                .updatedAt(progress.getUpdatedAt())
                .build();
    }
}
