package com.carebridge.controller;

import com.carebridge.dto.request.HelpRequestRequest;
import com.carebridge.dto.response.ApiResponse;
import com.carebridge.dto.response.HelpRequestResponse;
import com.carebridge.entity.User;
import com.carebridge.service.HelpRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class HelpRequestController {

    private final HelpRequestService helpRequestService;

    // ── List & Read ──────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<ApiResponse<List<HelpRequestResponse>>> getAll(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(helpRequestService.getAll(status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HelpRequestResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(helpRequestService.getById(id)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<HelpRequestResponse>>> getMyRequests(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.ok(helpRequestService.getMyRequests(currentUser)));
    }

    @GetMapping("/accepted")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<HelpRequestResponse>>> getAcceptedByMe(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.ok(helpRequestService.getAcceptedByMe(currentUser)));
    }

    // ── Create ───────────────────────────────────────────────────────────────
    // Only USER role opens help requests; VOLUNTEERs accept, not create.

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<HelpRequestResponse>> create(
            @Valid @RequestBody HelpRequestRequest dto,
            @AuthenticationPrincipal User currentUser) {
        HelpRequestResponse response = helpRequestService.create(dto, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Help request created", response));
    }

    // ── Update ───────────────────────────────────────────────────────────────
    // Service enforces: owner or ADMIN only.

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HelpRequestResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody HelpRequestRequest dto,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.ok(helpRequestService.update(id, dto, currentUser)));
    }

    // ── Delete ───────────────────────────────────────────────────────────────
    // Service enforces: owner or ADMIN only. ADMIN can delete any request.

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        helpRequestService.delete(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // ── State transitions ────────────────────────────────────────────────────

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public ResponseEntity<ApiResponse<HelpRequestResponse>> accept(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.ok(helpRequestService.accept(id, currentUser)));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('VOLUNTEER', 'ADMIN')")
    public ResponseEntity<ApiResponse<HelpRequestResponse>> complete(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.ok(helpRequestService.complete(id, currentUser)));
    }
}
