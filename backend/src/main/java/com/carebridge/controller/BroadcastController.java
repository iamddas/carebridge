package com.carebridge.controller;

import com.carebridge.dto.request.BroadcastRequest;
import com.carebridge.dto.response.ApiResponse;
import com.carebridge.dto.response.BroadcastResponse;
import com.carebridge.entity.User;
import com.carebridge.service.BroadcastService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/broadcast")
@RequiredArgsConstructor
public class BroadcastController {

    private final BroadcastService broadcastService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BroadcastResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(broadcastService.getAll()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BroadcastResponse>> create(
            @Valid @RequestBody BroadcastRequest dto,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Broadcast sent", broadcastService.create(dto, currentUser)));
    }
}
