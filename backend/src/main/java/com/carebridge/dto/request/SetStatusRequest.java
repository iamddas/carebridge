package com.carebridge.dto.request;

import jakarta.validation.constraints.NotNull;

public record SetStatusRequest(@NotNull Boolean enabled) {}
