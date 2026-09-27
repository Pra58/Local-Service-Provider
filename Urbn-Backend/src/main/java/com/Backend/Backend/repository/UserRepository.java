package com.Backend.Backend.repository;

import com.Backend.Backend.entity.RoleType;
import com.Backend.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(RoleType role);
}
