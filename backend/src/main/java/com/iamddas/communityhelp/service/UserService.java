package com.iamddas.communityhelp.service;

import com.iamddas.communityhelp.entity.User;
import com.iamddas.communityhelp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + user.getEmail());
        }
        // Ensure password is encoded
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        log.info("User created: {}", savedUser.getEmail());
        return savedUser;
    }

    @Transactional
    public User updateUser(Long id, User updated) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        existing.setName(updated.getName());
        
        // Only update email if it's different and doesn't already exist
        if (!existing.getEmail().equals(updated.getEmail())) {
            if (userRepository.existsByEmail(updated.getEmail())) {
                throw new IllegalArgumentException("Email already exists: " + updated.getEmail());
            }
            existing.setEmail(updated.getEmail());
        }
        
        existing.setRole(updated.getRole());
        existing.setStatus(updated.getStatus());

        User savedUser = userRepository.save(existing);
        log.info("User updated: {}", savedUser.getId());
        return savedUser;
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
        log.info("User deleted: {}", id);
    }
}
