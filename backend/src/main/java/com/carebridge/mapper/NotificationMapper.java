package com.carebridge.mapper;

import com.carebridge.dto.response.NotificationResponse;
import com.carebridge.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType().name(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
