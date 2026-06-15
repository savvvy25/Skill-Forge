package com.skillforge.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressRequest {

    @NotBlank(message = "Topic is required")
    private String topic;

    @Min(value = 0, message = "Easy count cannot be negative")
    private Integer easyCount;

    @Min(value = 0, message = "Medium count cannot be negative")
    private Integer mediumCount;

    @Min(value = 0, message = "Hard count cannot be negative")
    private Integer hardCount;
}
