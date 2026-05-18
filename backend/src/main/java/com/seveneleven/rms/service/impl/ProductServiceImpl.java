package com.seveneleven.rms.service.impl;

import com.seveneleven.rms.dto.request.ProductRequest;
import com.seveneleven.rms.dto.response.PageResponse;
import com.seveneleven.rms.dto.response.ProductResponse;
import com.seveneleven.rms.entity.Product;
import com.seveneleven.rms.exception.ResourceNotFoundException;
import com.seveneleven.rms.repository.ProductRepository;
import com.seveneleven.rms.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.cache.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    // Redis cache — lần 2 trở đi không query DB
    @Cacheable(value = "products", key = "'all_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    @Override
    public PageResponse<ProductResponse> getAllProducts(Pageable pageable) {
        log.debug("Fetching ALL products page {} from DATABASE", pageable.getPageNumber());
        return PageResponse.from(
                productRepository.findAll(pageable).map(this::toResponse)
        );
    }

    @Cacheable(value = "products", key = "'active_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    @Override
    public PageResponse<ProductResponse> getActiveProducts(Pageable pageable) {
        log.debug("Fetching ACTIVE products page {} from DATABASE", pageable.getPageNumber());
        return PageResponse.from(
                productRepository.findByActiveTrue(pageable).map(this::toResponse)
        );
    }

    @Cacheable(value = "product", key = "#id")
    @Override
    public ProductResponse getProductById(Long id) {
        log.debug("Fetching product {} from DATABASE", id);
        return toResponse(findById(id));
    }

    // Xóa cache khi có thay đổi data
    @Caching(evict = {
        @CacheEvict(value = "products", allEntries = true),
        @CacheEvict(value = "product", allEntries = true)
    })
    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .attributes(request.getAttributes())
                .active(true)
                .build();

        return toResponse(productRepository.save(product));
    }

    @Caching(evict = {
        @CacheEvict(value = "products", allEntries = true),
        @CacheEvict(value = "product", key = "#id")
    })
    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findById(id);

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setAttributes(request.getAttributes());

        return toResponse(productRepository.save(product));
    }

    @Caching(evict = {
        @CacheEvict(value = "products", allEntries = true),
        @CacheEvict(value = "product", key = "#id")
    })
    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = findById(id);
        product.setActive(false); // Soft delete
        productRepository.save(product);
    }

    private Product findById(Long id) {
        return productRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Product not found with id: " + id));
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .stock(p.getStock())
                .category(p.getCategory())
                .imageUrl(p.getImageUrl())
                .active(p.getActive())
                .attributes(p.getAttributes())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}