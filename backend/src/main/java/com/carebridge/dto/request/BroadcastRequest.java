package com.carebridge.dto.request;

import jakarta.validation.constraints.NotBlank;

public record BroadcastRequest(
        @NotBlank String title,
        @NotBlank String message
) {}
