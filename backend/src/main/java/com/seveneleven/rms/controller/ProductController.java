package com.seveneleven.rms.controller;

import com.seveneleven.rms.dto.request.ProductRequest;
import com.seveneleven.rms.dto.response.ProductResponse;
import com.seveneleven.rms.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Products", description = "Quản lý sản phẩm")
@SecurityRequirement(name = "bearerAuth")
public class ProductController {

    private final ProductService productService;

    // ─── USER endpoints ─────────────────────────────────────────

    @Operation(summary = "Danh sách sản phẩm active - dành cho User tạo đơn hàng")
    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getActiveProducts() {
        return ResponseEntity.ok(productService.getActiveProducts());
    }

    @Operation(summary = "Chi tiết sản phẩm")
    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // ─── ADMIN endpoints ─────────────────────────────────────────

    @Operation(summary = "[ADMIN] Danh sách tất cả sản phẩm kể cả đã xóa")
    @GetMapping("/admin/products")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @Operation(summary = "[ADMIN] Thêm sản phẩm mới")
    @PostMapping("/admin/products")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(201)
                .body(productService.createProduct(request));
    }

    @Operation(summary = "[ADMIN] Cập nhật sản phẩm")
    @PutMapping("/admin/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @Operation(summary = "[ADMIN] Xóa sản phẩm (soft delete)")
    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }
}