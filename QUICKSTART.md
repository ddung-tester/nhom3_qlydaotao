

### Port đang được sử dụng
```bash
# Backend (5000)
lsof -ti:5000 | xargs kill -9

# Frontend (3000)
lsof -ti:3000 | xargs kill -9
```

### Module not found
```bash
# Cài lại dependencies
cd backend && npm install
cd frontend && npm install
```

Để chuyển từ schema cũ sang schema mới (cho phép nhân viên đứng đầu không cần quản lý và ngăn tự quản lý chính mình), bạn cần chạy 3 lệnh SQL sau theo đúng thứ tự:

sql
-- 1. Cho phép cột quanly_id được để trống (bỏ ràng buộc NOT NULL)

ALTER TABLE nhanvien ALTER COLUMN quanly_id DROP NOT NULL;
-- 2. Cập nhật những nhân viên đang tự quản lý chính mình thành NULL (người đứng đầu)
-- Việc này giúp dữ liệu hiện tại không vi phạm ràng buộc sắp thêm ở bước 3
UPDATE nhanvien SET quanly_id = NULL WHERE user_id = quanly_id;

-- 3. Thêm ràng buộc để sau này không ai có thể tự chọn mình làm quản lý
ALTER TABLE nhanvien ADD CONSTRAINT no_self_management CHECK (user_id != quanly_id);
Lưu ý:

Bạn chạy các lệnh này trong pgAdmin Query Tool hoặc terminal psql.
Sau khi chạy xong, bạn có thể vào trang Quản lý nhân viên để chỉnh sửa: người đầu tiên hãy để trống ô "Quản lý", hệ thống sẽ tự động lưu là NULL.