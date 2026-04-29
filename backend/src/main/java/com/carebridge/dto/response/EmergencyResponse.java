package com.carebridge.dto.response;

import java.time.LocalDateTime;

public record EmergencyResponse(
        Long id,
        String title,
        String description,
        String priority,
        String location,
        UserSummaryResponse createdBy,
        LocalDateTime createdAt
) {}
