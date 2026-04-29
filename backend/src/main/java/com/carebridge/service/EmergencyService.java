package com.carebridge.service;

import com.carebridge.dto.request.EmergencyRequest;
import com.carebridge.dto.response.EmergencyResponse;
import com.carebridge.entity.EmergencyAlert;
import com.carebridge.entity.User;
import com.carebridge.mapper.EmergencyMapper;
import com.carebridge.repository.EmergencyAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmergencyService {

    private final EmergencyAlertRepository emergencyAlertRepository;
    private final EmergencyMapper emergencyMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public EmergencyResponse create(EmergencyRequest dto, User admin) {
        EmergencyAlert alert = EmergencyAlert.builder()
                .title(dto.title())
                .description(dto.description())
                .priority(dto.priority())
                .location(dto.location())
                .createdBy(admin)
                .build();
        EmergencyResponse response = emergencyMapper.toResponse(emergencyAlertRepository.save(alert));
        messagingTemplate.convertAndSend("/topic/emergency", response);
        return response;
    }

    public List<EmergencyResponse> getAll() {
        return emergencyAlertRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(emergencyMapper::toResponse).toList();
    }
}
