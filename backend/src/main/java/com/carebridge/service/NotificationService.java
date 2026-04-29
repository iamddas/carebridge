package com.carebridge.service;

import com.carebridge.dto.request.NotifyUserRequest;
import com.carebridge.dto.response.NotificationResponse;
import com.carebridge.entity.Notification;
import com.carebridge.entity.User;
import com.carebridge.exception.ResourceNotFoundException;
import com.carebridge.mapper.NotificationMapper;
import com.carebridge.repository.NotificationRepository;
import com.carebridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public List<NotificationResponse> getMyNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(notificationMapper::toResponse).toList();
    }

    public long countUnread(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }

    @Transactional
    public NotificationResponse markRead(Long id, User currentUser) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        if (!n.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Not your notification");
        }
        n.setRead(true);
        return notificationMapper.toResponse(notificationRepository.save(n));
    }

    @Transactional
    public NotificationResponse notifyUser(Long userId, NotifyUserRequest dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Notification n = Notification.builder()
                .user(user)
                .title(dto.title())
                .message(dto.message())
                .type(dto.type())
                .build();
        NotificationResponse response = notificationMapper.toResponse(notificationRepository.save(n));
        messagingTemplate.convertAndSendToUser(user.getUsername(), "/queue/notifications", response);
        return response;
    }

    @Transactional
    public int broadcastNotification(NotifyUserRequest dto) {
        List<User> users = userRepository.findAll();
        List<Notification> notifications = users.stream().map(user ->
                Notification.builder()
                        .user(user)
                        .title(dto.title())
                        .message(dto.message())
                        .type(dto.type())
                        .build()
        ).toList();
        List<Notification> saved = notificationRepository.saveAll(notifications);
        saved.forEach(n ->
                messagingTemplate.convertAndSendToUser(
                        n.getUser().getUsername(), "/queue/notifications", notificationMapper.toResponse(n))
        );
        return saved.size();
    }
}
