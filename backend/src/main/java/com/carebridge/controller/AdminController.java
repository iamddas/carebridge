package com.carebridge.controller;

import com.carebridge.dto.request.ChangeRoleRequest;
import com.carebridge.dto.request.SetStatusRequest;
import com.carebridge.dto.response.ApiResponse;
import com.carebridge.dto.response.HelpRequestResponse;
import com.carebridge.dto.response.UserResponse;
import com.carebridge.entity.User;
import com.carebridge.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getUsers(search)));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getUserById(id)));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> changeRole(
            @PathVariable Long id,
            @Valid @RequestBody ChangeRoleRequest request,
            @AuthenticationPrincipal User currentAdmin) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.changeRole(id, request.role(), currentAdmin)));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> setStatus(
            @PathVariable Long id,
            @Valid @RequestBody SetStatusRequest request,
            @AuthenticationPrincipal User currentAdmin) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.setStatus(id, request.enabled(), currentAdmin)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentAdmin) {
        adminService.deleteUser(id, currentAdmin);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/users/{id}/requests")
    public ResponseEntity<ApiResponse<List<HelpRequestResponse>>> getUserRequests(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getUserRequests(id)));
    }
}
