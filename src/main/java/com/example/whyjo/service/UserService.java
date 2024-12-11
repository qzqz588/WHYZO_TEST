package com.example.whyjo.service;

import com.example.whyjo.domain.dto.UserDto;
import com.example.whyjo.domain.entity.User;
import com.example.whyjo.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register(UserDto userDto) {
        if (existsByUserId(userDto.getUserId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        User.Address address = null;
        if (userDto.getAddress() != null) {
            address = User.Address.builder()
                    .zipCode(userDto.getAddress().getZipCode())
                    .address(userDto.getAddress().getAddress())
                    .addressDetail(userDto.getAddress().getAddressDetail())
                    .build();
        }

        User.MarketingConsent marketingConsent = null;
        if (userDto.getMarketingConsent() != null) {
            marketingConsent = User.MarketingConsent.builder()
                    .smsConsent(userDto.getMarketingConsent().isSmsConsent())
                    .emailConsent(userDto.getMarketingConsent().isEmailConsent())
                    .build();
        }

        String gender = userDto.getGender() != null ? userDto.getGender() : "선택안함";
        String birthDate = userDto.getBirthDate() != null ? userDto.getBirthDate() : "";

        User user = User.builder()
                .userId(userDto.getUserId())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .name(userDto.getName())
                .email(userDto.getEmail())
                .phone(userDto.getPhone())
                .address(address)
                .marketingConsent(marketingConsent)
                .gender(gender)
                .birthDate(birthDate)
                .role("ROLE_USER")
                .build();

        userRepository.save(user);
    }

    public boolean existsByUserId(String userId) {
        return userRepository.existsByUserId(userId);
    }

    public User findByUserId(String userId) {
        return userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }
} 