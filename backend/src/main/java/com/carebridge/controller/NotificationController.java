package com.carebridge.controller;

import com.carebridge.dto.request.NotifyUserRequest;
import com.carebridge.dto.response.ApiResponse;
import com.carebridge.dto.response.NotificationResponse;
import com.carebridge.entity.User;
import com.carebridge.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.getMyNotifications(currentUser)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.countUnread(currentUser)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.markRead(id, currentUser)));
    }

    @PostMapping("/admin/notify/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<NotificationResponse>> notifyUser(
            @PathVariable Long userId,
            @Valid @RequestBody NotifyUserRequest dto) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.notifyUser(userId, dto)));
    }

    @PostMapping("/admin/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> broadcastNotification(
            @Valid @RequestBody NotifyUserRequest dto) {
        int count = notificationService.broadcastNotification(dto);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("notified", count)));
    }
}
