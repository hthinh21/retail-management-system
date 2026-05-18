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
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login và Register")
public class AuthController {

    private final AuthService authService;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Operation(summary = "Đăng nhập", description = "Set JWT vào httpOnly cookie")
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
        @Valid @RequestBody LoginRequest request,
        HttpServletResponse response
    ) {
        AuthResponse auth = authService.login(request);

        // Set JWT vào httpOnly cookie
        Cookie cookie = new Cookie("jwt", auth.getToken());
        cookie.setHttpOnly(true);       // JS không đọc được
        cookie.setSecure(false);        // true khi dùng HTTPS production
        cookie.setPath("/");
        cookie.setMaxAge((int)(expiration / 1000));
        response.addCookie(cookie);

        // Không trả token trong body — chỉ trả user info
        auth.setToken(null);
        return ResponseEntity.ok(auth);
    }

    @Operation(summary = "Đăng xuất")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Xóa cookie ngay
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
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

    @Operation(summary = "Lấy thông tin user hiện tại")
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        // Lấy token từ cookie
        String token = Arrays.stream(
            request.getCookies() != null ? request.getCookies() : new Cookie[0])
            .filter(c -> "jwt".equals(c.getName()))
            .map(Cookie::getValue)
            .findFirst()
            .orElse(null);

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(401)
                .body(Map.of("message", "Not authenticated"));
        }

        return ResponseEntity.ok(Map.of("message", "Authenticated"));
    }
}