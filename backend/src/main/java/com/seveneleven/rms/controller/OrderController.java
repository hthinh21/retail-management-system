package com.seveneleven.rms.controller;

import com.seveneleven.rms.dto.request.OrderRequest;
import com.seveneleven.rms.dto.response.OrderResponse;
import com.seveneleven.rms.dto.response.PageResponse;
import com.seveneleven.rms.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Quản lý đơn hàng")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;

    // ─── USER endpoints ─────────────────────────────────────────

    @Operation(summary = "Tạo đơn hàng mới", description = "User tạo đơn từ danh sách sản phẩm")
    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(
            Principal principal,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = """
                        {
                            "items": [
                                {"productId": 1, "quantity": 2},
                                {"productId": 3, "quantity": 1}
                            ],
                            "note": "Giao trước 12h"
                        }
                    """))) @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.status(201)
                .body(orderService.createOrder(principal.getName(), request));
    }

    @Operation(summary = "Xem đơn hàng của tôi")
    @GetMapping("/orders/my")
    public ResponseEntity<PageResponse<OrderResponse>> getMyOrders(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getMyOrders(principal.getName(), pageable));
    }

    @Operation(summary = "Chi tiết đơn hàng")
    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable java.util.UUID id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // ─── ADMIN endpoints ─────────────────────────────────────────

    @Operation(summary = "[ADMIN] Xem tất cả đơn hàng")
    @GetMapping("/admin/orders")
    public ResponseEntity<PageResponse<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @Operation(summary = "[ADMIN] Xem đơn hàng của một user cụ thể", description = "Truyền username vào path")
    @GetMapping("/admin/orders/user/{username}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUsername(
            @PathVariable String username) {
        return ResponseEntity.ok(orderService.getOrdersByUsername(username));
    }

    @Operation(summary = "[ADMIN] Cập nhật trạng thái đơn hàng", description = "Status flow: PENDING → CONFIRMED → PAID → SHIPPING → DELIVERED | CANCELLED")
    @PatchMapping("/admin/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable java.util.UUID id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = """
                        {
                            "status": "CONFIRMED"
                        }
                    """))) @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                orderService.updateOrderStatus(id, body.get("status")));
    }
}