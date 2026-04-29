package com.carebridge.service;

import com.carebridge.dto.request.HelpRequestRequest;
import com.carebridge.dto.response.HelpRequestResponse;
import com.carebridge.entity.HelpRequest;
import com.carebridge.entity.RequestStatus;
import com.carebridge.entity.Role;
import com.carebridge.entity.User;
import com.carebridge.exception.BusinessException;
import com.carebridge.exception.ResourceNotFoundException;
import com.carebridge.mapper.HelpRequestMapper;
import com.carebridge.repository.HelpRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HelpRequestService {

    private final HelpRequestRepository helpRequestRepository;
    private final HelpRequestMapper helpRequestMapper;

    public List<HelpRequestResponse> getAll(String status) {
        if (status != null) {
            RequestStatus requestStatus;
            try {
                requestStatus = RequestStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BusinessException("Invalid status value: " + status);
            }
            return helpRequestRepository.findByStatusOrderByCreatedAtDesc(requestStatus)
                    .stream().map(helpRequestMapper::toResponse).toList();
        }
        return helpRequestRepository.findAllOrderByCreatedAtDesc()
                .stream().map(helpRequestMapper::toResponse).toList();
    }

    public HelpRequestResponse getById(Long id) {
        return helpRequestRepository.findById(id)
                .map(helpRequestMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Help request not found with id: " + id));
    }

    @Transactional
    public HelpRequestResponse create(HelpRequestRequest dto, User currentUser) {
        HelpRequest request = helpRequestMapper.toEntity(dto, currentUser);
        return helpRequestMapper.toResponse(helpRequestRepository.save(request));
    }

    @Transactional
    public HelpRequestResponse update(Long id, HelpRequestRequest dto, User currentUser) {
        HelpRequest request = findOrThrow(id);
        if (!isOwnerOrAdmin(request, currentUser)) {
            throw new AccessDeniedException("You can only edit your own requests");
        }
        request.setTitle(dto.title());
        request.setDescription(dto.description());
        request.setCategory(dto.category());
        request.setLocation(dto.location());
        return helpRequestMapper.toResponse(helpRequestRepository.save(request));
    }

    @Transactional
    public void delete(Long id, User currentUser) {
        HelpRequest request = findOrThrow(id);
        if (!isOwnerOrAdmin(request, currentUser)) {
            throw new AccessDeniedException("You can only delete your own requests");
        }
        helpRequestRepository.delete(request);
    }

    @Transactional
    public HelpRequestResponse accept(Long id, User volunteer) {
        HelpRequest request = findOrThrow(id);
        if (request.getStatus() != RequestStatus.OPEN) {
            throw new BusinessException("Only OPEN requests can be accepted");
        }
        request.setStatus(RequestStatus.ACCEPTED);
        request.setAcceptedBy(volunteer);
        return helpRequestMapper.toResponse(helpRequestRepository.save(request));
    }

    @Transactional
    public HelpRequestResponse complete(Long id, User currentUser) {
        HelpRequest request = findOrThrow(id);
        if (request.getStatus() != RequestStatus.ACCEPTED) {
            throw new BusinessException("Only ACCEPTED requests can be marked complete");
        }
        boolean isAcceptor = request.getAcceptedBy() != null
                && request.getAcceptedBy().getId().equals(currentUser.getId());
        if (!isAcceptor && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only the accepting volunteer or admin can complete this request");
        }
        request.setStatus(RequestStatus.COMPLETED);
        return helpRequestMapper.toResponse(helpRequestRepository.save(request));
    }

    public List<HelpRequestResponse> getMyRequests(User user) {
        return helpRequestRepository.findByCreatedByOrderByCreatedAtDesc(user)
                .stream().map(helpRequestMapper::toResponse).toList();
    }

    public List<HelpRequestResponse> getAcceptedByMe(User volunteer) {
        return helpRequestRepository.findByAcceptedByOrderByCreatedAtDesc(volunteer)
                .stream().map(helpRequestMapper::toResponse).toList();
    }

    private HelpRequest findOrThrow(Long id) {
        return helpRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Help request not found with id: " + id));
    }

    private boolean isOwnerOrAdmin(HelpRequest request, User user) {
        return request.getCreatedBy().getId().equals(user.getId()) || user.getRole() == Role.ADMIN;
    }
}
