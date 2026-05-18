package com.seveneleven.rms.service;

import com.seveneleven.rms.dto.request.LoginRequest;
import com.seveneleven.rms.dto.request.RegisterRequest;
import com.seveneleven.rms.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    void register(RegisterRequest request);
}