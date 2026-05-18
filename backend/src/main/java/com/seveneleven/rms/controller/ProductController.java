package com.seveneleven.rms.controller;

import com.seveneleven.rms.dto.request.ProductRequest;
import com.seveneleven.rms.dto.response.PageResponse;
import com.seveneleven.rms.dto.response.ProductResponse;
import com.seveneleven.rms.service.ProductService;

import org.springframework.data.domain.Sort;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<PageResponse<ProductResponse>> getActiveProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(productService.getActiveProducts(pageable));
    }

    @Operation(summary = "Chi tiết sản phẩm")
    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // ─── ADMIN endpoints ─────────────────────────────────────────

    @Operation(summary = "[ADMIN] Danh sách tất cả sản phẩm")
    @GetMapping("/admin/products")
    public ResponseEntity<PageResponse<ProductResponse>> getAllProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(productService.getAllProducts(pageable));
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