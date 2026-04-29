package com.carebridge.service;

import com.carebridge.dto.request.LoginRequest;
import com.carebridge.dto.request.RegisterRequest;
import com.carebridge.dto.response.AuthResponse;
import com.carebridge.entity.Role;
import com.carebridge.entity.User;
import com.carebridge.exception.DuplicateResourceException;
import com.carebridge.exception.ResourceNotFoundException;
import com.carebridge.mapper.UserMapper;
import com.carebridge.repository.UserRepository;
import com.carebridge.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        Role role = (request.role() == Role.VOLUNTEER) ? Role.VOLUNTEER : Role.USER;

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .build();

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        return new AuthResponse(token, userMapper.toResponse(saved));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, userMapper.toResponse(user));
    }
}
