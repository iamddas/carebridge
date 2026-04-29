package com.iamddas.communityhelp.repository;

import com.iamddas.communityhelp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
