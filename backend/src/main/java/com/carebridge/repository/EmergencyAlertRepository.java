package com.carebridge.repository;

import com.carebridge.entity.EmergencyAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmergencyAlertRepository extends JpaRepository<EmergencyAlert, Long> {
    List<EmergencyAlert> findAllByOrderByCreatedAtDesc();
}
