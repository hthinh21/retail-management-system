package com.seveneleven.rms.service.impl;

import com.seveneleven.rms.dto.request.LoginRequest;
import com.seveneleven.rms.dto.request.RegisterRequest;
import com.seveneleven.rms.dto.response.AuthResponse;
import com.seveneleven.rms.entity.User;
import com.seveneleven.rms.exception.ResourceNotFoundException;
import com.seveneleven.rms.repository.UserRepository;
import com.seveneleven.rms.security.JwtUtil;
import com.seveneleven.rms.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(
            user.getUsername(),
            user.getRole().name()
        );

        log.debug("User {} logged in successfully", user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(User.Role.USER)
                .build();

        userRepository.save(user);
        log.debug("User {} registered successfully", user.getUsername());
    }
}