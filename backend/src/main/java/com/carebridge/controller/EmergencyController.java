package com.carebridge.controller;

import com.carebridge.dto.request.EmergencyRequest;
import com.carebridge.dto.response.ApiResponse;
import com.carebridge.dto.response.EmergencyResponse;
import com.carebridge.entity.User;
import com.carebridge.service.EmergencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService emergencyService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmergencyResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(emergencyService.getAll()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmergencyResponse>> create(
            @Valid @RequestBody EmergencyRequest dto,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Emergency alert created", emergencyService.create(dto, currentUser)));
    }
}
