package com.skillforge.util;

import java.util.Collections;
import java.util.List;

/**
 * Defines the canonical list of 17 DSA topics tracked by SkillForge.
 * Used to calculate dashboard completion percentage.
 */
public final class DsaTopics {

    private DsaTopics() {
        // Utility class — prevent instantiation
    }

    public static final List<String> TOPICS = Collections.unmodifiableList(List.of(
            "Arrays",
            "Strings",
            "Linked List",
            "Stacks",
            "Queues",
            "Trees",
            "Graphs",
            "Sorting",
            "Searching",
            "Dynamic Programming",
            "Greedy",
            "Backtracking",
            "Bit Manipulation",
            "Hashing",
            "Heap",
            "Recursion",
            "Sliding Window"
    ));

    public static final int TOTAL_TOPICS = TOPICS.size();
}
