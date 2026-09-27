package com.Backend.Backend.repository;

import com.Backend.Backend.entity.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceItem, Long> {

    List<ServiceItem> findByActiveTrue();

    List<ServiceItem> findByCategoryIgnoreCaseAndActiveTrue(String category);

    List<ServiceItem> findByProviderId(Long providerId);
}
