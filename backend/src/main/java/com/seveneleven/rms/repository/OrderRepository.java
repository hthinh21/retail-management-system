package com.seveneleven.rms.repository;

import com.seveneleven.rms.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderRepository extends JpaRepository<Order, java.util.UUID> {
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Order> findByUserUsernameOrderByCreatedAtDesc(String username, Pageable pageable);
}