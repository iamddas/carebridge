package com.carebridge.service;

import com.carebridge.dto.response.HelpRequestResponse;
import com.carebridge.dto.response.UserResponse;
import com.carebridge.entity.Role;
import com.carebridge.entity.User;
import com.carebridge.exception.BusinessException;
import com.carebridge.exception.ResourceNotFoundException;
import com.carebridge.mapper.HelpRequestMapper;
import com.carebridge.mapper.UserMapper;
import com.carebridge.repository.HelpRequestRepository;
import com.carebridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final HelpRequestRepository helpRequestRepository;
    private final UserMapper userMapper;
    private final HelpRequestMapper helpRequestMapper;

    public List<UserResponse> getUsers(String search) {
        if (search != null && !search.isBlank()) {
            return userRepository
                    .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search)
                    .stream().map(userMapper::toResponse).toList();
        }
        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(userMapper::toResponse).toList();
    }

    @Transactional
    public UserResponse changeRole(Long id, Role role, User currentAdmin) {
        User user = findOrThrow(id);
        if (user.getId().equals(currentAdmin.getId())) {
            throw new BusinessException("Cannot change your own role");
        }
        user.setRole(role);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse setStatus(Long id, boolean enabled, User currentAdmin) {
        User user = findOrThrow(id);
        if (user.getId().equals(currentAdmin.getId())) {
            throw new BusinessException("Cannot change your own status");
        }
        user.setEnabled(enabled);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id, User currentAdmin) {
        User user = findOrThrow(id);
        if (user.getId().equals(currentAdmin.getId())) {
            throw new BusinessException("Cannot delete your own account");
        }
        userRepository.delete(user);
    }

    public List<HelpRequestResponse> getUserRequests(Long userId) {
        User user = findOrThrow(userId);
        return helpRequestRepository.findByCreatedByOrderByCreatedAtDesc(user)
                .stream().map(helpRequestMapper::toResponse).toList();
    }

    public UserResponse getUserById(Long id) {
        return userMapper.toResponse(findOrThrow(id));
    }

    private User findOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
