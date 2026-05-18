package com.seveneleven.rms.service.impl;

import com.seveneleven.rms.dto.request.OrderItemRequest;
import com.seveneleven.rms.dto.request.OrderRequest;
import com.seveneleven.rms.dto.response.OrderItemResponse;
import com.seveneleven.rms.dto.response.OrderResponse;
import com.seveneleven.rms.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;
import com.seveneleven.rms.entity.*;
import com.seveneleven.rms.exception.ResourceNotFoundException;
import com.seveneleven.rms.repository.*;
import com.seveneleven.rms.service.OrderService;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "orders", allEntries = true),
            @CacheEvict(value = "my_orders", key = "#username")
    })
    public OrderResponse createOrder(String username, OrderRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found: " + username));

        List<OrderItem> items = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(Objects.requireNonNull(itemReq.getProductId()))
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found: " + itemReq.getProductId()));

            if (!product.getActive()) {
                throw new IllegalArgumentException(
                        "Product không còn kinh doanh: " + product.getName());
            }

            if (product.getStock() < itemReq.getQuantity()) {
                throw new IllegalArgumentException(
                        "Sản phẩm '" + product.getName() + "' không đủ số lượng. " +
                                "Còn lại: " + product.getStock());
            }

            // Trừ stock
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            BigDecimal subtotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem item = OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .subtotal(subtotal)
                    .build();

            items.add(item);
            totalPrice = totalPrice.add(subtotal);
        }

        Order order = Order.builder()
                .user(user)
                .status(Order.OrderStatus.PENDING)
                .totalPrice(totalPrice)
                .note(request.getNote())
                .build();

        // Set order reference cho từng item
        items.forEach(item -> item.setOrder(order));
        order.getItems().addAll(items);

        Order saved = orderRepository.save(order);
        log.debug("Order {} created by {}", saved.getId(), username);

        // Evict product cache vì stock đã thay đổi
        return toResponse(saved);
    }

    @Override
    @Cacheable(value = "my_orders", key = "#username + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public PageResponse<OrderResponse> getMyOrders(String username, Pageable pageable) {
        log.debug("Fetching orders of {} page {} from DATABASE", username, pageable.getPageNumber());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found: " + username));

        return PageResponse.from(
                orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable).map(this::toResponse)
        );
    }

    @Override
    @Cacheable(value = "orders", key = "'all_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public PageResponse<OrderResponse> getAllOrders(Pageable pageable) {
        log.debug("Fetching ALL orders page {} from DATABASE", pageable.getPageNumber());
        return PageResponse.from(
                orderRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::toResponse)
        );
    }

    @Override
    @Cacheable(value = "order", key = "#id")
    public OrderResponse getOrderById(java.util.UUID id) {
        log.debug("Fetching order {} from DATABASE", id);
        return toResponse(findById(id));
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "orders", allEntries = true),
            @CacheEvict(value = "order", key = "#id"),
            @CacheEvict(value = "my_orders", allEntries = true)
    })
    public OrderResponse updateOrderStatus(java.util.UUID id, String status) {
        Order order = findById(id);

        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Status không hợp lệ. Các giá trị hợp lệ: " +
                            "PENDING, CONFIRMED, PAID, SHIPPING, DELIVERED, CANCELLED");
        }

        Order saved = orderRepository.save(order);
        log.debug("Order {} status updated to {}", id, status);
        return toResponse(saved);
    }

    private Order findById(@NonNull java.util.UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: " + id));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImageUrl(item.getProduct().getImageUrl())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getSubtotal())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .username(order.getUser().getUsername())
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .note(order.getNote())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    @Override
    @Cacheable(value = "user_orders", key = "#username")
    public List<OrderResponse> getOrdersByUsername(String username) {
        log.debug("Fetching orders of user {} from DATABASE", username);

        // Kiểm tra user tồn tại không
        if (!userRepository.existsByUsername(username)) {
            throw new ResourceNotFoundException("User not found: " + username);
        }

        return orderRepository.findByUserUsernameOrderByCreatedAtDesc(username, Pageable.unpaged())
                .getContent()
                .stream()
                .map(this::toResponse)
                .toList();
    }
}