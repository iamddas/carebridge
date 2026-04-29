package com.carebridge.service;

import com.carebridge.dto.request.BroadcastRequest;
import com.carebridge.dto.response.BroadcastResponse;
import com.carebridge.entity.Broadcast;
import com.carebridge.entity.User;
import com.carebridge.mapper.BroadcastMapper;
import com.carebridge.repository.BroadcastRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BroadcastService {

    private final BroadcastRepository broadcastRepository;
    private final BroadcastMapper broadcastMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public BroadcastResponse create(BroadcastRequest dto, User admin) {
        Broadcast broadcast = Broadcast.builder()
                .title(dto.title())
                .message(dto.message())
                .createdBy(admin)
                .build();
        BroadcastResponse response = broadcastMapper.toResponse(broadcastRepository.save(broadcast));
        messagingTemplate.convertAndSend("/topic/broadcasts", response);
        return response;
    }

    public List<BroadcastResponse> getAll() {
        return broadcastRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(broadcastMapper::toResponse).toList();
    }
}
