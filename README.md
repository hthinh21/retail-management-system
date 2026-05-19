# Retail Management System

Hệ thống quản lý bán lẻ cho 7-Eleven Vietnam - bài test demo.

---

## Tech Stack

### Backend
- Java 21 + Spring Boot 3.2
- Spring Security + JWT (httpOnly Cookie)
- Spring Data JPA + Hibernate
- PostgreSQL 15
- Redis 7 (Cache)
- Swagger UI (OpenAPI 3)
- JUnit 5 + Mockito

### Frontend
- React 18 + Vite
- TailwindCSS 3
- React Router v6
- React Query (TanStack)
- Zustand
- Axios

### Infrastructure
- Docker + Docker Compose

---

## Yêu cầu

| Tool | Version |
|---|---|
| Docker Desktop | >= 4.x |
| Node.js | >= 18.x |
| Java | >= 21 (optional — chỉ cần nếu chạy backend ngoài Docker) |

---

## Cài đặt & Chạy

### 1. Clone project

```bash
git clone https://github.com/your-username/retail-management-system.git
cd retail-management-system
```

### 2. Chạy Backend + Database (Docker)

```bash
docker-compose up --build
```

Lần đầu sẽ mất 3-5 phút để pull image và build. Các lần sau nhanh hơn nhờ cache.

Kiểm tra backend đã chạy:
```bash
curl http://localhost:8080/api/v1/products
```

### 3. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Vào `http://localhost:5173`

---

## Tài khoản demo

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| User | `user` | `user123` |

---

## Cấu trúc project
```text
retail-management-system/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/java/com/seveneleven/rms/
│   │   │   ├── config/               # Cấu hình Security, Redis, Swagger, CORS
│   │   │   ├── controller/           # REST API endpoints (Controllers)
│   │   │   ├── dto/
│   │   │   │   ├── request/          # DTOs gửi lên từ Client
│   │   │   │   └── response/         # DTOs trả về từ Server
│   │   │   ├── entity/               # Thực thể Database (JPA Entities)
│   │   │   ├── exception/            # Bộ xử lý lỗi tập trung (Global Exception Handler)
│   │   │   ├── repository/           # Lớp truy vấn Database (JPA Repositories)
│   │   │   ├── security/             # JWT Filter, JwtUtil
│   │   │   └── service/              # Lớp dịch vụ (Business logic Interfaces)
│   │   │       └── impl/             # Lớp hiện thực dịch vụ (Implementations)
│   │   └── test/java/com/seveneleven/rms/
│   │       └── service/              # Thư mục chứa Unit Tests (e.g., AuthServiceTest)
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                         # React + Vite
│   ├── src/
│   │   ├── api/                      # Axios API calls
│   │   ├── components/               # Reusable components
│   │   │   ├── cart/
│   │   │   ├── layout/
│   │   │   ├── product/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── admin/                # Admin pages
│   │   │   ├── auth/                 # Login page
│   │   │   └── user/                 # User pages
│   │   ├── store/                    # Zustand stores
│   │   └── utils/                    # Helper functions
│   └── package.json
│
├── docs/                             # Documentation
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

Swagger UI: `http://localhost:8080/api/v1/swagger-ui.html`

### Auth
| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Public | Đăng nhập |
| POST | `/api/v1/auth/register` | Public | Đăng ký |
| POST | `/api/v1/auth/logout` | Public | Đăng xuất |

### Products
| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/v1/products` | User/Admin | Danh sách active |
| GET | `/api/v1/products/{id}` | User/Admin | Chi tiết |
| GET | `/api/v1/admin/products` | Admin | Tất cả sản phẩm |
| POST | `/api/v1/admin/products` | Admin | Thêm mới |
| PUT | `/api/v1/admin/products/{id}` | Admin | Cập nhật |
| DELETE | `/api/v1/admin/products/{id}` | Admin | Xóa (soft delete) |

### Orders
| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/v1/orders` | User/Admin | Tạo đơn hàng |
| GET | `/api/v1/orders/my` | User/Admin | Đơn hàng của tôi |
| GET | `/api/v1/orders/{id}` | User/Admin | Chi tiết đơn |
| GET | `/api/v1/admin/orders` | Admin | Tất cả đơn hàng |
| GET | `/api/v1/admin/orders/user/{username}` | Admin | Đơn theo user |
| PATCH | `/api/v1/admin/orders/{id}/status` | Admin | Cập nhật trạng thái |

---

## Database Schema

users
id, username, email, password, role, created_at, updated_at
products
id, name, description, price, stock, category,
image_url, active, attributes (JSONB), created_at, updated_at
orders
id, user_id, status, total_price, note, created_at, updated_at
order_items
id, order_id, product_id, quantity, unit_price, subtotal

### Order Status Flow

PENDING → CONFIRMED → PAID → SHIPPING → DELIVERED
  ↓
CANCELLED (bất kỳ bước nào)

---

## Caching Strategy

Redis (Server-side)              React Query (Client-side)
───────────────────              ─────────────────────────
products cache: 10 phút          products cache: 5 phút
orders cache: 10 phút            orders cache: 5 phút
Evict khi: create/update/delete  Invalidate khi: mutation

---

## Chạy Unit Test

```bash
cd backend
docker exec -it rms-backend mvn test

# Hoặc nếu có Java + Maven local
mvn test
```

---

## Architecture

                ┌─────────────────┐
                │   React + Vite  │
                │  localhost:5173 │
                └────────┬────────┘
                         │ HTTP + Cookie
                ┌────────▼────────┐
                │  Spring Boot    │
                │  localhost:8080 │
                └──┬─────────┬───┘
                   │         │
          ┌────────▼──┐   ┌───▼──────┐
          │ PostgreSQL │  │  Redis   │
          │  :5432     │  │  :6379   │
          └────────────┘  └──────────┘

---

## Scalability Notes

- **Stateless JWT** → Horizontal scaling ready
- **Redis cache** → Giảm DB load
- **Soft delete** → Data integrity, audit trail
- **JSONB attributes** → Flexible product schema
- **Pagination** → Xử lý được dataset lớn
- **Production**: Nginx load balancer + multiple Spring Boot instances

```bash
# Scale backend instances
docker-compose up --scale backend=3
```

---

## DECISIONS.md

Xem [`docs/DECISIONS.md`](docs/DECISIONS.md) để hiểu lý do chọn tech stack.