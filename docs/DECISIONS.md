# Architecture Decision Records

## 1. PostgreSQL thay vì MongoDB

**Quyết định:** Dùng PostgreSQL làm primary database.

**Lý do:**
- Data có quan hệ rõ ràng: Order → OrderItem → Product cần JOIN và ACID transaction
- Khi tạo order cần atomic transaction: tạo Order + OrderItem + trừ stock trong 1 transaction
- JPA/Hibernate support native, không cần thêm driver
- JSONB column cho product attributes → có lợi thế của cả SQL lẫn NoSQL

**Trade-off:**
- MongoDB phù hợp hơn cho product catalog với schema không đồng đều
- Production nên dùng MongoDB cho logging, audit trail

---

## 2. JWT httpOnly Cookie thay vì localStorage

**Quyết định:** Lưu JWT trong httpOnly cookie.

**Lý do:**
- localStorage dễ bị XSS attack — JavaScript có thể đọc và đánh cắp token
- httpOnly cookie không đọc được bằng JS → an toàn hơn
- Tự động gửi kèm mọi request → không cần manually attach header

**Trade-off:**
- Cần config CORS với `allowCredentials: true`
- Cần handle CSRF (disabled vì dùng SameSite cookie)

---

## 3. Redis Cache

**Quyết định:** Cache product list và order list trong Redis.

**Lý do:**
- Product list là read-heavy, ít thay đổi → cache giảm DB load
- TTL 10 phút phù hợp với business (giá thay đổi không quá thường xuyên)
- Evict cache ngay khi có create/update/delete → data consistency

---

## 4. Soft Delete thay vì Hard Delete

**Quyết định:** Xóa product bằng cách set `active = false`.

**Lý do:**
- Giữ data integrity: OrderItem vẫn reference đến Product đã xóa
- Audit trail: biết được lịch sử sản phẩm
- Có thể restore nếu xóa nhầm

---

## 5. React Query thay vì Redux

**Quyết định:** Dùng TanStack React Query cho server state.

**Lý do:**
- Server state (API data) và client state (UI) nên tách biệt
- React Query tự handle loading, error, caching, refetch
- Ít boilerplate hơn Redux Toolkit
- Zustand đủ cho client state (cart, auth)