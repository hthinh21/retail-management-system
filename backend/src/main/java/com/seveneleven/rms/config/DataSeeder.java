package com.seveneleven.rms.config;

import com.seveneleven.rms.entity.Product;
import com.seveneleven.rms.entity.User;
import com.seveneleven.rms.repository.ProductRepository;
import com.seveneleven.rms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            // Seed users
            if (userRepository.count() == 0) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

                userRepository.saveAll(List.of(
                    User.builder()
                        .username("admin")
                        .password(encoder.encode("admin123"))
                        .email("admin@7-eleven.vn")
                        .role(User.Role.ADMIN)
                        .build(),
                    User.builder()
                        .username("user")
                        .password(encoder.encode("user123"))
                        .email("user@7-eleven.vn")
                        .role(User.Role.USER)
                        .build()
                ));
            }

            // Seed products 7-Eleven style           
            if (productRepository.count() == 0) {
                productRepository.saveAll(List.of(
                    Product.builder()
                        .name("Cà phê Americano")
                        .description("Cà phê đen pha máy, thơm ngon")
                        .price(new BigDecimal("29000"))
                        .stock(100)
                        .category("Đồ uống")
                        .imageUrl("https://placehold.co/300x300?text=Americano")
                        .attributes(Map.of("size", "M", "hot", true))
                        .build(),
                    Product.builder()
                        .name("Trà sữa trân châu")
                        .description("Trà sữa Thái trân châu đen")
                        .price(new BigDecimal("35000"))
                        .stock(80)
                        .category("Đồ uống")
                        .imageUrl("https://placehold.co/300x300?text=TraSua")
                        .attributes(Map.of("size", "L", "sugar", "50%", "ice", "ít đá"))
                        .build(),
                    Product.builder()
                        .name("Bánh mì thịt nướng")
                        .description("Bánh mì kẹp thịt nướng mật ong")
                        .price(new BigDecimal("25000"))
                        .stock(50)
                        .category("Thức ăn")
                        .imageUrl("https://placehold.co/300x300?text=BanhMi")
                        .attributes(Map.of("calories", 350, "weight", "150g"))
                        .build(),
                    Product.builder()
                        .name("Cơm gà teriyaki")
                        .description("Cơm gà sốt teriyaki kiểu Nhật")
                        .price(new BigDecimal("45000"))
                        .stock(30)
                        .category("Thức ăn")
                        .imageUrl("https://placehold.co/300x300?text=ComGa")
                        .attributes(Map.of("calories", 520, "weight", "250g"))
                        .build(),
                    Product.builder()
                        .name("Nước suối Aquafina 500ml")
                        .description("Nước tinh khiết Aquafina")
                        .price(new BigDecimal("10000"))
                        .stock(200)
                        .category("Đồ uống")
                        .imageUrl("https://placehold.co/300x300?text=Aquafina")
                        .attributes(Map.of("volume", "500ml"))
                        .build(),
                    Product.builder()
                        .name("Snack Oishi tôm")
                        .description("Bánh snack tôm giòn Oishi")
                        .price(new BigDecimal("10000"))
                        .stock(150)
                        .category("Snack")
                        .imageUrl("https://placehold.co/300x300?text=Oishi")
                        .attributes(Map.of("weight", "40g", "flavor", "tôm"))
                        .build(),
                    Product.builder()
                        .name("Mì cay Hảo Hảo")
                        .description("Mì ăn liền cay đặc biệt")
                        .price(new BigDecimal("7000"))
                        .stock(300)
                        .category("Mì & Cháo")
                        .imageUrl("https://placehold.co/300x300?text=HaoHao")
                        .attributes(Map.of("spicy_level", 2, "weight", "75g"))
                        .build(),
                    Product.builder()
                        .name("Kem Walls Cornetto")
                        .description("Kem ốc quế socola Cornetto")
                        .price(new BigDecimal("15000"))
                        .stock(60)
                        .category("Kem & Bánh")
                        .imageUrl("https://placehold.co/300x300?text=Cornetto")
                        .attributes(Map.of("flavor", "socola", "weight", "120ml"))
                        .build()
                ));
            }
        };
    }
}