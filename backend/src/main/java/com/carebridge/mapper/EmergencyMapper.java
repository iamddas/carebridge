package com.carebridge.mapper;

import com.carebridge.dto.response.EmergencyResponse;
import com.carebridge.entity.EmergencyAlert;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmergencyMapper {

    private final UserMapper userMapper;

    public EmergencyResponse toResponse(EmergencyAlert a) {
        return new EmergencyResponse(
                a.getId(),
                a.getTitle(),
                a.getDescription(),
                a.getPriority(),
                a.getLocation(),
                a.getCreatedBy() != null ? userMapper.toSummary(a.getCreatedBy()) : null,
                a.getCreatedAt()
        );
    }
}
