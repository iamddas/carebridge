package com.carebridge.dto.response;

import java.time.LocalDateTime;

public record MessageResponse(
        Long id,
        UserSummaryResponse sender,
        UserSummaryResponse receiver,
        String content,
        boolean read,
        LocalDateTime createdAt
) {}
