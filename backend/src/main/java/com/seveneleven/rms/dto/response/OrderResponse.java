package com.seveneleven.rms.dto.response;

import com.seveneleven.rms.entity.Order.OrderStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private java.util.UUID id;
    private String username;
    private OrderStatus status;
    private BigDecimal totalPrice;
    private String note;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}