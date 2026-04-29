package com.carebridge.service;

import com.carebridge.dto.request.MessageRequest;
import com.carebridge.dto.response.MessageResponse;
import com.carebridge.entity.Message;
import com.carebridge.entity.User;
import com.carebridge.exception.ResourceNotFoundException;
import com.carebridge.mapper.MessageMapper;
import com.carebridge.repository.MessageRepository;
import com.carebridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final MessageMapper messageMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public List<MessageResponse> getConversation(Long otherUserId, User currentUser) {
        User other = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + otherUserId));
        return messageRepository.findConversation(currentUser, other)
                .stream().map(messageMapper::toResponse).toList();
    }

    @Transactional
    public MessageResponse send(MessageRequest dto, User sender) {
        User receiver = userRepository.findById(dto.receiverId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.receiverId()));
        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(dto.content())
                .build();
        MessageResponse response = messageMapper.toResponse(messageRepository.save(message));
        messagingTemplate.convertAndSendToUser(receiver.getUsername(), "/queue/messages", response);
        return response;
    }

    public List<MessageResponse> getAllMessages() {
        return messageRepository.findAllOrderByCreatedAtDesc()
                .stream().map(messageMapper::toResponse).toList();
    }

    @Transactional
    public void deleteMessage(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + id));
        messageRepository.delete(message);
    }

    @Transactional
    public MessageResponse markRead(Long id, User currentUser) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + id));
        if (message.getReceiver().getId().equals(currentUser.getId())) {
            message.setRead(true);
            return messageMapper.toResponse(messageRepository.save(message));
        }
        return messageMapper.toResponse(message);
    }
}
