package com.carebridge.repository;

import com.carebridge.entity.Message;
import com.carebridge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.sender = :a AND m.receiver = :b) OR (m.sender = :b AND m.receiver = :a) ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("a") User a, @Param("b") User b);

    @Query("SELECT m FROM Message m ORDER BY m.createdAt DESC")
    List<Message> findAllOrderByCreatedAtDesc();
}
