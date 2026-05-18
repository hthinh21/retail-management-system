package com.seveneleven.rms.service;

import com.seveneleven.rms.dto.request.ProductRequest;
import com.seveneleven.rms.dto.response.PageResponse;
import com.seveneleven.rms.dto.response.ProductResponse;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    PageResponse<ProductResponse> getAllProducts(Pageable pageable);
    PageResponse<ProductResponse> getActiveProducts(Pageable pageable);
    ProductResponse getProductById(Long id);
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
}