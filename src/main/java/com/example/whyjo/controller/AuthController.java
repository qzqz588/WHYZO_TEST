package com.example.whyjo.controller;

import com.example.whyjo.domain.dto.LoginRequestDto;
import com.example.whyjo.domain.dto.LoginResponseDto;
import com.example.whyjo.domain.entity.User;
import com.example.whyjo.security.JwtTokenProvider;
import com.example.whyjo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        try {
            // 입력값 검증
            if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
                return ResponseEntity.badRequest()
                    .body("아이디와 비밀번호를 모두 입력해주세요.");
            }

            // 1. Login ID/PW를 기반으로 Authentication 객체 생성
            UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());

            try {
                // 2. 실제 검증 (사용자 비밀번호 체크)
                Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

                // 3. 인증 정보를 기반으로 JWT 토큰 생성
                String token = jwtTokenProvider.generateToken(authentication);

                // 4. 사용자 정보 조회
                User user = userService.findByUserId(loginRequest.getUsername());

                // 응답 데이터 생성
                LoginResponseDto responseDto = LoginResponseDto.builder()
                        .token(token)
                        .userId(user.getUserId())
                        .name(user.getName())
                        .build();

                // 응답 데이터 로깅
                log.info("Login Response: {}", responseDto);

                return ResponseEntity.ok(responseDto);

            } catch (BadCredentialsException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("아이디 또는 비밀번호가 올바르지 않습니다.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("로그인 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
} 