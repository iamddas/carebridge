package com.carebridge.dto.request;

import com.carebridge.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NotifyUserRequest(
        @NotBlank String title,
        @NotBlank String message,
        @NotNull NotificationType type
) {}
