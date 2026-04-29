package com.iamddas.communityhelp.repository;

import com.iamddas.communityhelp.entity.HelpRequest;
import com.iamddas.communityhelp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelpRequestRepository extends JpaRepository<HelpRequest, Long> {
    List<HelpRequest> findByCreatedByOrderByCreatedAtDesc(User createdBy);
    List<HelpRequest> findByOrderByCreatedAtDesc();
}
