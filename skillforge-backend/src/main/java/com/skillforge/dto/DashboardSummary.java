package com.skillforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummary {

    private int totalSolved;
    private int easySolved;
    private int mediumSolved;
    private int hardSolved;
    private int topicsCovered;
    private double completionPercentage;
}
