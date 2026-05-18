package com.seveneleven.rms.service;

import com.seveneleven.rms.dto.request.OrderRequest;
import com.seveneleven.rms.dto.response.OrderResponse;

import com.seveneleven.rms.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface OrderService {
    OrderResponse createOrder(String username, OrderRequest request);
    PageResponse<OrderResponse> getMyOrders(String username, Pageable pageable);
    List<OrderResponse> getOrdersByUsername(String username);
    PageResponse<OrderResponse> getAllOrders(Pageable pageable);
    OrderResponse getOrderById(java.util.UUID id);
    OrderResponse updateOrderStatus(java.util.UUID id, String status);
}