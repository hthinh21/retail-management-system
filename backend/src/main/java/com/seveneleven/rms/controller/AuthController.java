package com.seveneleven.rms.controller;

import com.seveneleven.rms.entity.User;
import com.seveneleven.rms.repository.UserRepository;
import com.seveneleven.rms.security.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login và Register")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Operation(
        summary = "Đăng nhập",
        description = "Trả về JWT token. Dùng token này cho các request tiếp theo ở header: Authorization: Bearer {token}"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Đăng nhập thành công",
            content = @Content(mediaType = "application/json",
                examples = @ExampleObject(value = """
                    {
                        "token": "eyJhbGciOiJIUzI1NiJ9...",
                        "username": "admin",
                        "role": "ADMIN"
                    }
                """)
            )
        ),
        @ApiResponse(responseCode = "401", description = "Sai username hoặc password")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                {
                    "username": "admin",
                    "password": "admin123"
                }
            """))
        )
        @RequestBody Map<String, String> body
    ) {
        String username = body.get("username");
        String password = body.get("password");

        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid username or password"));
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", user.getRole().name()
        ));
    }

    @Operation(
        summary = "Đăng ký tài khoản mới",
        description = "Mặc định role là USER"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Đăng ký thành công"),
        @ApiResponse(responseCode = "400", description = "Username hoặc email đã tồn tại")
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                {
                    "username": "newuser",
                    "password": "password123",
                    "email": "newuser@example.com"
                }
            """))
        )
        @RequestBody Map<String, String> body
    ) {
        String username = body.get("username");
        String password = body.get("password");
        String email = body.get("email");

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username already exists"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already exists"));
        }

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .email(email)
                .role(User.Role.USER)
                .build();

        userRepository.save(Objects.requireNonNull(user));

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }
}