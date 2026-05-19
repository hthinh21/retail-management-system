package com.seveneleven.rms.service;

import com.seveneleven.rms.dto.request.LoginRequest;
import com.seveneleven.rms.dto.request.RegisterRequest;
import com.seveneleven.rms.dto.response.AuthResponse;
import com.seveneleven.rms.entity.User;
import com.seveneleven.rms.exception.ResourceNotFoundException;
import com.seveneleven.rms.repository.UserRepository;
import com.seveneleven.rms.security.JwtUtil;
import com.seveneleven.rms.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .username("admin")
                .password("$2a$10$hashedPassword")
                .email("admin@7-eleven.vn")
                .role(User.Role.ADMIN)
                .build();
    }

    @Test
    @DisplayName("Login thành công → trả về token")
    void login_ShouldReturnToken_WhenCredentialsValid() {
        // Arrange
        LoginRequest request = new LoginRequest("admin", "admin123");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("admin123", mockUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken("admin", "ADMIN")).thenReturn("mocked.jwt.token");

        // Act
        AuthResponse result = authService.login(request);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getToken()).isEqualTo("mocked.jwt.token");
        assertThat(result.getUsername()).isEqualTo("admin");
        assertThat(result.getRole()).isEqualTo("ADMIN");
    }

    @Test
    @DisplayName("Login sai password → throw exception")
    void login_ShouldThrow_WhenPasswordWrong() {
        // Arrange
        LoginRequest request = new LoginRequest("admin", "wrongpassword");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("wrongpassword", mockUser.getPassword()))
            .thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Invalid username or password");
    }

    @Test
    @DisplayName("Login username không tồn tại → throw exception")
    void login_ShouldThrow_WhenUserNotFound() {
        // Arrange
        LoginRequest request = new LoginRequest("unknown", "password");
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    @DisplayName("Register thành công")
    void register_ShouldSaveUser_WhenValid() {
        // Arrange
        RegisterRequest request = new RegisterRequest(
            "newuser", "password123", "new@example.com");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$hashed");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // Act & Assert — không throw là pass
        assertThatNoException().isThrownBy(() -> authService.register(request));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Register username đã tồn tại → throw exception")
    void register_ShouldThrow_WhenUsernameExists() {
        // Arrange
        RegisterRequest request = new RegisterRequest(
            "admin", "password123", "new@example.com");
        when(userRepository.existsByUsername("admin")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Username already exists");
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Register email đã tồn tại → throw exception")
    void register_ShouldThrow_WhenEmailExists() {
        // Arrange
        RegisterRequest request = new RegisterRequest(
            "newuser", "password123", "admin@7-eleven.vn");
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("admin@7-eleven.vn")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email already exists");
    }
}
