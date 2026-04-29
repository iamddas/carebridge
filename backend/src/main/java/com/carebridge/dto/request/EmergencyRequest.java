package com.carebridge.dto.request;

import jakarta.validation.constraints.NotBlank;

public record EmergencyRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String priority,
        String location
) {}
