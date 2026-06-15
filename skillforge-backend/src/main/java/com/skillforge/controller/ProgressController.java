package com.skillforge.controller;

import com.skillforge.dto.ApiResponse;
import com.skillforge.dto.DashboardSummary;
import com.skillforge.dto.ProgressRequest;
import com.skillforge.dto.ProgressResponse;
import com.skillforge.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    /**
     * POST /api/progress
     * Adds or updates DSA progress for a topic.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ProgressResponse>> addProgress(
            Authentication authentication,
            @Valid @RequestBody ProgressRequest request) {
        Long userId = extractUserId(authentication);
        ProgressResponse response = progressService.addProgress(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Progress saved successfully", response));
    }

    /**
     * GET /api/progress
     * Retrieves all DSA progress entries for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProgressResponse>>> getAllProgress(
            Authentication authentication) {
        Long userId = extractUserId(authentication);
        List<ProgressResponse> progressList = progressService.getAllProgress(userId);
        return ResponseEntity.ok(ApiResponse.success("Progress retrieved successfully", progressList));
    }

    /**
     * GET /api/progress/summary
     * Returns an aggregated dashboard summary of the user's DSA progress.
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummary>> getDashboardSummary(
            Authentication authentication) {
        Long userId = extractUserId(authentication);
        DashboardSummary summary = progressService.getDashboardSummary(userId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary retrieved successfully", summary));
    }

    /**
     * PUT /api/progress/{id}
     * Updates an existing DSA progress entry.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProgressResponse>> updateProgress(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ProgressRequest request) {
        Long userId = extractUserId(authentication);
        ProgressResponse response = progressService.updateProgress(userId, id, request);
        return ResponseEntity.ok(ApiResponse.success("Progress updated successfully", response));
    }

    /**
     * DELETE /api/progress/{id}
     * Deletes a DSA progress entry.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProgress(
            Authentication authentication,
            @PathVariable Long id) {
        Long userId = extractUserId(authentication);
        progressService.deleteProgress(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Progress deleted successfully"));
    }

    /**
     * Extracts the user ID from the JWT-authenticated principal.
     */
    private Long extractUserId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }
}
