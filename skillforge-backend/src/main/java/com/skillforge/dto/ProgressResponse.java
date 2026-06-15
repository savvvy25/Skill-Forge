package com.skillforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressResponse {

    private Long id;
    private String topic;
    private Integer easyCount;
    private Integer mediumCount;
    private Integer hardCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
