package com.carebridge.dto.response;

import java.time.LocalDateTime;

public record HelpRequestResponse(
        Long id,
        String title,
        String description,
        String category,
        String status,
        String location,
        UserSummaryResponse createdBy,
        UserSummaryResponse acceptedBy,
        LocalDateTime createdAt
) {}
