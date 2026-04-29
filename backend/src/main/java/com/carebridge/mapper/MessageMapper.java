package com.carebridge.mapper;

import com.carebridge.dto.response.MessageResponse;
import com.carebridge.entity.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageMapper {

    private final UserMapper userMapper;

    public MessageResponse toResponse(Message m) {
        return new MessageResponse(
                m.getId(),
                userMapper.toSummary(m.getSender()),
                userMapper.toSummary(m.getReceiver()),
                m.getContent(),
                m.isRead(),
                m.getCreatedAt()
        );
    }
}
