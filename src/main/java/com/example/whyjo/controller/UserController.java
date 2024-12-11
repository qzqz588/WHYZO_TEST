package com.example.whyjo.controller;

import com.example.whyjo.domain.dto.UserDto;
import com.example.whyjo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDto userDto) {
        userService.register(userDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/checkId/{userId}")
    public ResponseEntity<Boolean> checkDuplicateId(@PathVariable String userId) {
        return ResponseEntity.ok(userService.existsByUserId(userId));
    }
} 