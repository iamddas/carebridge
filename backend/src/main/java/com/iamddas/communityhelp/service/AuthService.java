package com.iamddas.communityhelp.service;

import com.iamddas.communityhelp.dto.LoginDTO;
import com.iamddas.communityhelp.dto.RegisterDTO;
import com.iamddas.communityhelp.dto.AuthResponseDTO;
import com.iamddas.communityhelp.dto.UserDTO;
import com.iamddas.communityhelp.entity.User;
import com.iamddas.communityhelp.entity.UserRole;
import com.iamddas.communityhelp.entity.UserStatus;
import com.iamddas.communityhelp.repository.UserRepository;
import com.iamddas.communityhelp.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponseDTO register(RegisterDTO registerDTO) {
        // Validate passwords match
        if (!registerDTO.passwordsMatch()) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setName(registerDTO.getName());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getEmail());

        // Generate token
        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().getValue());

        return new AuthResponseDTO(
                token,
                convertToUserDTO(savedUser)
        );
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginDTO loginDTO) {
        // Find user by email
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login attempt with non-existent email: {}", loginDTO.getEmail());
                    return new IllegalArgumentException("Invalid email or password");
                });

        // Verify password
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            log.warn("Failed login attempt for user: {}", user.getEmail());
            throw new IllegalArgumentException("Invalid email or password");
        }

        log.info("User logged in successfully: {}", user.getEmail());

        // Generate token
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().getValue());

        return new AuthResponseDTO(
                token,
                convertToUserDTO(user)
        );
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole().getValue());
        userDTO.setStatus(user.getStatus().getValue());
        userDTO.setCreatedAt(user.getCreatedAt().toString());
        return userDTO;
    }
}
