package com.seveneleven.rms.controller;

import com.seveneleven.rms.dto.request.LoginRequest;
import com.seveneleven.rms.dto.request.RegisterRequest;
import com.seveneleven.rms.dto.response.AuthResponse;
import com.seveneleven.rms.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login và Register")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Đăng nhập", description = "Trả về JWT token")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Đăng nhập thành công"),
        @ApiResponse(responseCode = "401", description = "Sai username hoặc password")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(examples = @ExampleObject(value = """
                {
                    "username": "admin",
                    "password": "admin123"
                }
            """))
        )
        @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Đăng ký tài khoản", description = "Mặc định role USER")
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
        @Valid @RequestBody RegisterRequest request
    ) {
        authService.register(request);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }
}