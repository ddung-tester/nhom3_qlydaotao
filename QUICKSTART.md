# QUICKSTART GUIDE - Hướng dẫn chạy nhanh

## Chạy nhanh trong 5 phút

### 1. Setup Database (1 phút)
```bash
# Tạo database
createdb training_center

# Import schema và seed data
psql -d training_center -f database/schema.sql
psql -d training_center -f database/seed.sql
```

### 2. Chạy Backend (1 phút)
```bash
cd backend
npm install
# Sửa file .env nếu cần (đặc biệt DB_PASSWORD)
npm start
```

✅ Backend chạy tại: http://localhost:5000

### 3. Chạy Frontend (1 phút)
```bash
# Mở terminal mới
cd frontend
npm install
npm run dev
```

✅ Frontend chạy tại: http://localhost:3000

### 4. Truy cập ứng dụng
Mở trình duyệt: **http://localhost:3000**

## Test nhanh

### Test Backend API
```bash
# Kiểm tra server
curl http://localhost:5000/health

# Lấy danh sách học viên
curl http://localhost:5000/api/hocvien

# Lấy danh sách giảng viên
curl http://localhost:5000/api/giangvien
```

### Test Frontend
1. Click vào "Học viên" trên sidebar → Xem danh sách
2. Click "Thêm học viên" → Điền form → Lưu
3. Click "Sửa" trên 1 học viên → Thay đổi → Cập nhật
4. Thử các menu khác: Giảng viên, Nhân viên, Chương trình, v.v.

## Trang đã hoàn thiện
- ✅ Học viên (với multi-phone)
- ✅ Giảng viên (với chuyên môn)
- ✅ Nhân viên (với hierarchical manager)
- ✅ Chương trình đào tạo
- ✅ Môn học
- ✅ Kỳ học

## Các trang còn lại
Sử dụng stub placeholder - Copy pattern từ các trang đã có để hoàn thiện.

API backend đã sẵn sàng cho tất cả endpoints!

## Troubleshooting

### Lỗi kết nối database
```bash
# Kiểm tra PostgreSQL đang chạy
pg_isready

# Kiểm tra .env có đúng password không
cat backend/.env
```

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