package com.carebridge.dto.response;

import java.time.LocalDateTime;

public record BroadcastResponse(
        Long id,
        String title,
        String message,
        UserSummaryResponse createdBy,
        LocalDateTime createdAt
) {}
