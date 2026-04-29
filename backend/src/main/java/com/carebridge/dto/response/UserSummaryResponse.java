package com.carebridge.dto.response;

public record UserSummaryResponse(
        Long id,
        String name,
        String email
) {}
