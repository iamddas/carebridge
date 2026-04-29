package com.carebridge.mapper;

import com.carebridge.dto.response.BroadcastResponse;
import com.carebridge.entity.Broadcast;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BroadcastMapper {

    private final UserMapper userMapper;

    public BroadcastResponse toResponse(Broadcast b) {
        return new BroadcastResponse(
                b.getId(),
                b.getTitle(),
                b.getMessage(),
                b.getCreatedBy() != null ? userMapper.toSummary(b.getCreatedBy()) : null,
                b.getCreatedAt()
        );
    }
}
