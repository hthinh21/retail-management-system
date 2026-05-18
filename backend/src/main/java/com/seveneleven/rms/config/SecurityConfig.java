package com.seveneleven.rms.config;

import com.seveneleven.rms.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                // Public
                                                .requestMatchers("/auth/**").permitAll()
                                                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/api-docs/**")
                                                .permitAll()
                                                // Admin only
                                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                                // Products: Khách vãng lai xem được, Admin mới được sửa
                                                .requestMatchers(org.springframework.http.HttpMethod.GET, "/products/**").permitAll()
                                                .requestMatchers("/products/**").hasRole("ADMIN")
                                                // Orders: Cả User và Admin đều thao tác được (User mua hàng, Admin xử lý đơn)
                                                .requestMatchers("/orders/**").hasAnyRole("USER", "ADMIN")
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }
}