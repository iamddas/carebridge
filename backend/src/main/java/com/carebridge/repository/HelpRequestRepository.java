package com.carebridge.repository;

import com.carebridge.entity.HelpRequest;
import com.carebridge.entity.RequestStatus;
import com.carebridge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HelpRequestRepository extends JpaRepository<HelpRequest, Long> {

    List<HelpRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    @Query("SELECT h FROM HelpRequest h ORDER BY h.createdAt DESC")
    List<HelpRequest> findAllOrderByCreatedAtDesc();

    List<HelpRequest> findByCreatedByOrderByCreatedAtDesc(User createdBy);

    List<HelpRequest> findByAcceptedByOrderByCreatedAtDesc(User acceptedBy);

    long countByStatus(RequestStatus status);

    long countByCreatedBy(User createdBy);
}
