package com.carebridge.mapper;

import com.carebridge.dto.request.HelpRequestRequest;
import com.carebridge.dto.response.HelpRequestResponse;
import com.carebridge.entity.HelpRequest;
import com.carebridge.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class HelpRequestMapper {

    private final UserMapper userMapper;

    public HelpRequestResponse toResponse(HelpRequest request) {
        return new HelpRequestResponse(
                request.getId(),
                request.getTitle(),
                request.getDescription(),
                request.getCategory() != null ? request.getCategory().name() : null,
                request.getStatus().name(),
                request.getLocation(),
                request.getCreatedBy() != null ? userMapper.toSummary(request.getCreatedBy()) : null,
                request.getAcceptedBy() != null ? userMapper.toSummary(request.getAcceptedBy()) : null,
                request.getCreatedAt()
        );
    }

    public HelpRequest toEntity(HelpRequestRequest dto, User createdBy) {
        return HelpRequest.builder()
                .title(dto.title())
                .description(dto.description())
                .category(dto.category())
                .location(dto.location())
                .createdBy(createdBy)
                .build();
    }
}
