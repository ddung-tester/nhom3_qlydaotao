-- ============================================================================
-- DỮ LIỆU MẪU CHO HỆ THỐNG QUẢN LÝ TRUNG TÂM ĐÀO TẠO
-- Theo yêu cầu khóa học (Mục 4.5)
-- ============================================================================

-- Xóa tất cả dữ liệu hiện có và đặt lại identity
TRUNCATE TABLE XepLich RESTART IDENTITY CASCADE;
TRUNCATE TABLE PhongHoc RESTART IDENTITY CASCADE;
TRUNCATE TABLE BuoiHoc RESTART IDENTITY CASCADE;
TRUNCATE TABLE PhanCong RESTART IDENTITY CASCADE;
TRUNCATE TABLE DiemThi RESTART IDENTITY CASCADE;
TRUNCATE TABLE DangKyKhoa RESTART IDENTITY CASCADE;
TRUNCATE TABLE LopMonHoc RESTART IDENTITY CASCADE;
TRUNCATE TABLE KhoaDaoTao RESTART IDENTITY CASCADE;
TRUNCATE TABLE MonHoc RESTART IDENTITY CASCADE;
TRUNCATE TABLE KyHoc RESTART IDENTITY CASCADE;
TRUNCATE TABLE ChuongTrinh RESTART IDENTITY CASCADE;
TRUNCATE TABLE NhanVien RESTART IDENTITY CASCADE;
TRUNCATE TABLE GiangVien RESTART IDENTITY CASCADE;
TRUNCATE TABLE HocVien RESTART IDENTITY CASCADE;
TRUNCATE TABLE User_SDT RESTART IDENTITY CASCADE;
TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;

-- ============================================================================
-- 1. User - Thông tin người dùng cơ bản
-- ============================================================================
INSERT INTO "User" (HoTen, NgaySinh, Email) VALUES
-- Nhân viên (4 người)
('Trần Văn An', '1980-03-15', 'tran.van.an@center.edu.vn'),
('Nguyễn Thị Bình', '1982-07-20', 'nguyen.thi.binh@center.edu.vn'),
('Lê Hoàng Cường', '1985-11-10', 'le.hoang.cuong@center.edu.vn'),
('Phạm Thu Dung', '1988-05-25', 'pham.thu.dung@center.edu.vn'),
-- Giảng viên (6 người)
('TS. Nguyễn Văn Hùng', '1975-08-12', 'nguyen.van.hung@tea.ptit.edu.vn'),
('PGS. Trần Thị Lan', '1978-12-05', 'tran.thi.lan@tea.ptit.edu.vn'),
('ThS. Lê Minh Tuấn', '1980-04-18', 'le.minh.tuan@tea.ptit.edu.vn'),
('TS. Phạm Thị Hoa', '1979-09-22', 'pham.thi.hoa@tea.ptit.edu.vn'),
('ThS. Hoàng Văn Nam', '1983-01-30', 'hoang.van.nam@tea.ptit.edu.vn'),
('CN. Vũ Thị Mai', '1987-06-14', 'vu.thi.mai@tea.ptit.edu.vn'),
-- Học viên (10 người)
('Trần Đình Dũng', '1998-05-15', 'tran.dinh.dung@stu.ptit.edu.vn'),
('Phạm Minh Hiếu', '1999-08-22', 'pham.minh.hieu@stu.ptit.edu.vn'),
('Nguyễn Quốc Việt', '1998-11-30', 'nguyen.quoc.viet@stu.ptit.edu.vn'),
('Lê Thị Hương', '1999-03-12', 'le.thi.huong@stu.ptit.edu.vn'),
('Trần Văn Long', '1998-07-08', 'tran.van.long@stu.ptit.edu.vn'),
('Nguyễn Thị Nga', '1999-12-25', 'nguyen.thi.nga@stu.ptit.edu.vn'),
('Phạm Văn Tú', '1998-02-18', 'pham.van.tu@stu.ptit.edu.vn'),
('Hoàng Thị Linh', '1999-09-05', 'hoang.thi.linh@stu.ptit.edu.vn'),
('Đỗ Văn Kiên', '1998-10-20', 'do.van.kien@stu.ptit.edu.vn'),
('Bùi Thị Trang', '1999-06-14', 'bui.thi.trang@stu.ptit.edu.vn');

-- ============================================================================
-- 2. User_SDT - Số điện thoại (thuộc tính đa trị)
-- ============================================================================
INSERT INTO User_SDT (USER_ID, SDT) VALUES
(1, '0901234567'), (2, '0901234568'), (3, '0901234569'), (4, '0901234570'),
(5, '0902345671'), (6, '0902345672'), (7, '0902345673'), (8, '0902345674'),
(9, '0902345675'), (10, '0902345676'),
(11, '0903456781'), (12, '0903456782'), (13, '0903456783'), (14, '0903456784'),
(15, '0903456785'), (16, '0903456786'), (17, '0903456787'), (18, '0903456788'),
(19, '0903456789'), (20, '0903456790');

-- ============================================================================
-- 3. NhanVien - Nhân viên với quản lý phân cấp
-- ============================================================================
INSERT INTO NhanVien (USER_ID, NgayVaoLam, QuanLy_ID) VALUES
(1, '2020-01-15', 1),  -- Trần Văn An (Giám đốc - Tự quản lý)
(2, '2020-03-20', 1),  -- Nguyễn Thị Bình (Báo cáo cho An)
(3, '2021-06-10', 1),  -- Lê Hoàng Cường (Báo cáo cho An)
(4, '2021-09-01', 2);  -- Phạm Thu Dung (Báo cáo cho Bình)

-- ============================================================================
-- 4. GiangVien - Giảng viên
-- ============================================================================
INSERT INTO GiangVien (USER_ID, ChuyenMon) VALUES
(5, 'Hệ Thống Thông Tin'),
(6, 'Trí Tuệ Nhân Tạo'),
(7, 'Cơ Sở Dữ Liệu'),
(8, 'Mạng Máy Tính'),
(9, 'Lập Trình Web'),
(10, 'An Toàn Thông Tin');

-- ============================================================================
-- 5. HocVien - Học viên
-- ============================================================================
INSERT INTO HocVien (USER_ID, DiaChi) VALUES
(11, '123 Đường Láng, Hà Nội'),
(12, '45 Trần Phú, Hải Phòng'),
(13, '78 Lê Lợi, Đà Nẵng'),
(14, '90 Nguyễn Huệ, Hà Nội'),
(15, '12 Điện Biên Phủ, TP.HCM'),
(16, '34 Hai Bà Trưng, Hà Nội'),
(17, '56 Quang Trung, Hải Dương'),
(18, '78 Lý Thường Kiệt, Hà Nội'),
(19, '90 Trần Hưng Đạo, Quảng Ninh'),
(20, '12 Lê Duẩn, Hà Nội');

-- ============================================================================
-- 6. ChuongTrinh - Chương trình đào tạo
-- ============================================================================
INSERT INTO ChuongTrinh (TenCT, MoTa, NV_QuanLy_ID) VALUES
('Sau Đại Học CNTT', 'Chương trình đào tạo sau đại học về Công nghệ thông tin', 1),
('Bồi Dưỡng Nghiệp Vụ', 'Chương trình bồi dưỡng nghiệp vụ chuyên sâu', 2),
('Chứng Chỉ Quốc Tế', 'Chương trình chuẩn bị chứng chỉ quốc tế', 3);

-- ============================================================================
-- 7. MonHoc - Môn học
-- ============================================================================
INSERT INTO MonHoc (MH_MA, CT_ID, TenMH, SoGio) VALUES
-- Chương trình 1: Sau Đại Học CNTT
('SDH-HTTT-01', 1, 'Hệ Thống Thông Tin', 45),
('SDH-CSDL-01', 1, 'Cơ Sở Dữ Liệu Nâng Cao', 60),
('SDH-TTNT-01', 1, 'Trí Tuệ Nhân Tạo', 45),
('SDH-MMT-01', 1, 'Mạng Máy Tính', 45),
('SDH-LTW-01', 1, 'Lập Trình Web', 60),
-- Chương trình 2: Bồi Dưỡng Nghiệp Vụ
('BDN-TKHT-01', 2, 'Thiết Kế Hệ Thống', 30),
('BDN-QLDA-01', 2, 'Quản Lý Dự Án', 30),
-- Chương trình 3: Chứng Chỉ Quốc Tế
('CCI-ATTT-01', 3, 'An Toàn Thông Tin', 45);

-- ============================================================================
-- 8. KyHoc - Kỳ học
-- ============================================================================
INSERT INTO KyHoc (HocKy, Nam, NgayBatDau, NgayKetThuc) VALUES
('1', 2024, '2024-01-08', '2024-05-31'),
('2', 2024, '2024-06-03', '2024-10-31'),
('3', 2024, '2024-11-04', '2025-03-31'),
('1', 2025, '2025-01-06', '2025-05-30'),
('2', 2025, '2025-06-02', '2025-10-30'),
('1', 2026, '2026-01-05', '2026-05-29');

-- ============================================================================
-- 9. KhoaDaoTao - Khóa đào tạo
-- ============================================================================
INSERT INTO KhoaDaoTao (CT_ID, KY_ID, TenKhoa, NgayKhaiGiang) VALUES
(1, 1, 'Khóa CNTT K01 - Kỳ 1/2024', '2024-01-15'),  -- KDT_ID=1 (cho kiểm tra 5.2.3)
(1, 2, 'Khóa CNTT K02 - Kỳ 2/2024', '2024-06-10'),  -- KDT_ID=2 (đã hoàn thành)
(2, 1, 'Khóa Nghiệp Vụ K01 - Kỳ 1/2024', '2024-01-20'),  -- KDT_ID=3 (đã hoàn thành)
(1, 6, 'Khóa CNTT K03 - Kỳ 1/2026', '2026-01-12');  -- KDT_ID=4 (hiện tại, cho tính lương)

-- ============================================================================
-- 10. LopMonHoc - Lớp môn học
-- ============================================================================
INSERT INTO LopMonHoc (KDT_ID, MH_MA) VALUES
-- KDT_ID=1: Khóa K01 (cho kiểm tra học viên chưa hoàn thành 5.2.3)
(1, 'SDH-HTTT-01'), (1, 'SDH-CSDL-01'), (1, 'SDH-TTNT-01'),
-- KDT_ID=2: Khóa K02 (đã hoàn thành)
(2, 'SDH-HTTT-01'), (2, 'SDH-MMT-01'), (2, 'SDH-LTW-01'),
-- KDT_ID=3: Khóa Nghiệp Vụ K01 (đã hoàn thành)
(3, 'BDN-TKHT-01'), (3, 'BDN-QLDA-01'),
-- KDT_ID=4: Khóa K03 - 2026 (cho tính lương giảng viên 5.2.4)
(4, 'SDH-HTTT-01'), (4, 'SDH-CSDL-01'), (4, 'SDH-TTNT-01'), (4, 'SDH-MMT-01');

-- ============================================================================
-- 11. DangKyKhoa - Đăng ký khóa học
-- ============================================================================
INSERT INTO DangKyKhoa (HV_ID, KDT_ID, NgayDK, TrangThai) VALUES
-- KDT_ID=1: DANG_HOC (cho báo cáo học viên chưa hoàn thành 5.2.3)
(11, 1, '2024-01-05', 'DANG_HOC'),
(12, 1, '2024-01-05', 'DANG_HOC'),
(13, 1, '2024-01-06', 'DANG_HOC'),
(14, 1, '2024-01-06', 'DANG_HOC'),
-- KDT_ID=2: HOAN_THANH (cho báo cáo kết quả học tập 5.2.2)
(15, 2, '2024-06-01', 'HOAN_THANH'),
(16, 2, '2024-06-01', 'HOAN_THANH'),
(17, 2, '2024-06-02', 'HOAN_THANH'),
-- KDT_ID=3: HOAN_THANH (cho báo cáo kết quả học tập 5.2.2)
(18, 3, '2024-01-15', 'HOAN_THANH'),
(19, 3, '2024-01-15', 'HOAN_THANH'),
-- KDT_ID=4: DANG_HOC (khóa học hiện tại cho kiểm tra tính lương)
(11, 4, '2026-01-02', 'DANG_HOC'),
(12, 4, '2026-01-02', 'DANG_HOC'),
(13, 4, '2026-01-03', 'DANG_HOC');

-- ============================================================================
-- 12. DiemThi - Điểm thi (thiết kế cho các báo cáo 5.2.2 và 5.2.3)
-- ============================================================================
INSERT INTO DiemThi (HV_ID, LopMH_ID, LanThi, Diem, NgayThi) VALUES
-- KDT_ID=1 (LopMH_ID: 1, 2, 3) - HỌC VIÊN CHƯA HOÀN THÀNH với điểm trượt
-- Học viên 13 (Nguyễn Quốc Việt): Trượt CSDL (≤5) 2 lần + trượt TTNT 1 lần
(13, 1, 1, 7.5, '2024-03-15'),   -- HTTT: qua
(13, 2, 1, 3.5, '2024-03-20'),   -- CSDL: trượt (≤5)
(13, 2, 2, 4.5, '2024-04-10'),   -- CSDL: trượt lại (≤5)
(13, 3, 1, 4.0, '2024-03-25'),   -- TTNT: trượt (≤5)
-- Học viên 14 (Lê Thị Hương): Trượt CSDL 1 lần, chưa thi lại
(14, 1, 1, 8.0, '2024-03-15'),   -- HTTT: qua
(14, 2, 1, 2.5, '2024-03-20'),   -- CSDL: trượt (≤5)
-- Học viên 12 (Phạm Minh Hiếu): Trượt 1 lần nhưng đã qua khi thi lại (KHÔNG phải chưa hoàn thành)
(12, 1, 1, 4.5, '2024-03-15'),   -- HTTT: trượt (≤5)
(12, 1, 2, 8.5, '2024-04-10'),   -- HTTT: qua khi thi lại
(12, 2, 1, 7.5, '2024-03-20'),   -- CSDL: qua
(12, 3, 1, 6.0, '2024-03-25'),   -- TTNT: qua
-- Học viên 11 (Trần Đình Dũng): Tất cả đều qua
(11, 1, 1, 8.5, '2024-03-15'),
(11, 2, 1, 9.0, '2024-03-20'),
(11, 3, 1, 7.5, '2024-03-25'),
-- KDT_ID=2 (LopMH_ID: 4, 5, 6) - Khóa học ĐÃ HOÀN THÀNH
(15, 4, 1, 9.5, '2024-08-15'),
(15, 5, 1, 8.0, '2024-08-20'),
(15, 6, 1, 7.5, '2024-08-25'),
(16, 4, 1, 7.0, '2024-08-15'),
(16, 5, 1, 6.5, '2024-08-20'),
(16, 6, 1, 8.0, '2024-08-25'),
(17, 4, 1, 8.5, '2024-08-15'),
(17, 5, 1, 9.0, '2024-08-20'),
(17, 6, 1, 8.5, '2024-08-25'),
-- KDT_ID=3 (LopMH_ID: 7, 8) - Khóa học ĐÃ HOÀN THÀNH
(18, 7, 1, 8.0, '2024-03-10'),
(18, 8, 1, 7.5, '2024-03-15'),
(19, 7, 1, 9.0, '2024-03-10'),
(19, 8, 1, 8.5, '2024-03-15');

-- ============================================================================
-- 13. BuoiHoc - Buổi học (Tháng 2/2026 cho tính lương 5.2.4)
-- ============================================================================
INSERT INTO BuoiHoc (NgayHoc, GioBD, GioKt) VALUES
-- Tuần 1 tháng 2/2026
('2026-02-02', '08:00', '10:00'), ('2026-02-02', '10:15', '12:15'), ('2026-02-02', '13:30', '15:30'),
('2026-02-03', '08:00', '10:00'), ('2026-02-03', '10:15', '12:15'), ('2026-02-03', '13:30', '15:30'),
('2026-02-04', '08:00', '10:00'), ('2026-02-04', '10:15', '12:15'), ('2026-02-04', '13:30', '15:30'),
('2026-02-05', '08:00', '10:00'), ('2026-02-05', '10:15', '12:15'), ('2026-02-05', '13:30', '15:30'),
('2026-02-06', '08:00', '10:00'), ('2026-02-06', '10:15', '12:15'),
-- Tuần 2 tháng 2/2026
('2026-02-09', '08:00', '10:00'), ('2026-02-09', '10:15', '12:15'), ('2026-02-09', '13:30', '15:30'),
('2026-02-10', '08:00', '10:00'), ('2026-02-10', '10:15', '12:15'), ('2026-02-10', '13:30', '15:30'),
('2026-02-11', '08:00', '10:00'), ('2026-02-11', '10:15', '12:15'), ('2026-02-11', '13:30', '15:30'),
('2026-02-12', '08:00', '10:00'), ('2026-02-12', '10:15', '12:15'), ('2026-02-12', '13:30', '15:30'),
('2026-02-13', '08:00', '10:00'), ('2026-02-13', '10:15', '12:15'),
-- Tuần 3 tháng 2/2026
('2026-02-16', '08:00', '10:00'), ('2026-02-16', '10:15', '12:15'), ('2026-02-16', '13:30', '15:30'),
('2026-02-17', '08:00', '10:00'), ('2026-02-17', '10:15', '12:15'), ('2026-02-17', '13:30', '15:30'),
('2026-02-18', '08:00', '10:00'), ('2026-02-18', '10:15', '12:15'), ('2026-02-18', '13:30', '15:30'),
('2026-02-19', '08:00', '10:00'), ('2026-02-19', '10:15', '12:15'), ('2026-02-19', '13:30', '15:30'),
('2026-02-20', '08:00', '10:00'), ('2026-02-20', '10:15', '12:15'),
-- Tuần 4 tháng 2/2026
('2026-02-23', '08:00', '10:00'), ('2026-02-23', '10:15', '12:15'), ('2026-02-23', '13:30', '15:30'),
('2026-02-24', '08:00', '10:00'), ('2026-02-24', '10:15', '12:15'), ('2026-02-24', '13:30', '15:30'),
('2026-02-25', '08:00', '10:00'), ('2026-02-25', '10:15', '12:15'), ('2026-02-25', '13:30', '15:30'),
('2026-02-26', '08:00', '10:00'), ('2026-02-26', '10:15', '12:15'), ('2026-02-26', '13:30', '15:30'),
('2026-02-27', '08:00', '10:00'), ('2026-02-27', '10:15', '12:15');

-- ============================================================================
-- 14. PhongHoc - Phòng học
-- ============================================================================
INSERT INTO PhongHoc (DiaDiem, MaPhong) VALUES
('Tòa A - Tầng 1', 'A101'),
('Tòa A - Tầng 1', 'A102'),
('Tòa A - Tầng 2', 'A201'),
('Tòa B - Tầng 1', 'B101'),
('Tòa B - Tầng 2', 'B201'),
('Tòa C - Tầng 1', 'C101');

-- ============================================================================
-- 15. XepLich - Lịch học (50 buổi cho các lớp KDT_ID=4)
-- ============================================================================
INSERT INTO XepLich (BuoiHoc_ID, LopMH_ID, PH_ID) VALUES
-- KDT_ID=4 có LopMH_ID: 9=HTTT, 10=CSDL, 11=TTNT, 12=MMT
(1, 9, 1), (2, 10, 2), (3, 11, 3), (4, 12, 4), (5, 9, 1), (6, 10, 2), (7, 11, 3),
(8, 12, 4), (9, 9, 5), (10, 10, 1), (11, 11, 2), (12, 12, 3), (13, 9, 4), (14, 10, 5),
(15, 11, 1), (16, 12, 2), (17, 9, 3), (18, 10, 4), (19, 11, 5), (20, 12, 1), (21, 9, 2),
(22, 10, 3), (23, 11, 4), (24, 12, 5), (25, 9, 1), (26, 10, 2), (27, 11, 3), (28, 12, 4),
(29, 9, 5), (30, 10, 1), (31, 11, 2), (32, 12, 3), (33, 9, 4), (34, 10, 5), (35, 11, 1),
(36, 12, 2), (37, 9, 3), (38, 10, 4), (39, 11, 5), (40, 12, 1), (41, 9, 2), (42, 10, 3),
(43, 11, 4), (44, 12, 5), (45, 9, 1), (46, 10, 2), (47, 11, 3), (48, 12, 4), (49, 9, 5), (50, 10, 1);

-- ============================================================================
-- 16. PhanCong - Phân công giảng dạy (cho tính lương 5.2.4)
-- ============================================================================
INSERT INTO PhanCong (GV_ID, LopMH_ID, VaiTro) VALUES
-- TS. Nguyễn Văn Hùng (GV_ID=5): Giảng viên chính HTTT (LopMH_ID=9)
(5, 9, 'GIANGVIEN'),
-- PGS. Trần Thị Lan (GV_ID=6): Giảng viên chính TTNT (LopMH_ID=11)
(6, 11, 'GIANGVIEN'),
-- ThS. Lê Minh Tuấn (GV_ID=7): GV chính CSDL (10) + Trợ giảng HTTT (9)
(7, 10, 'GIANGVIEN'),
(7, 9, 'TROGIANG'),
-- TS. Phạm Thị Hoa (GV_ID=8): Giảng viên chính MMT (12)
(8, 12, 'GIANGVIEN'),
-- ThS. Hoàng Văn Nam (GV_ID=9): Trợ giảng TTNT (11) + Trợ giảng MMT (12)
(9, 11, 'TROGIANG'),
(9, 12, 'TROGIANG'),
-- CN. Vũ Thị Mai (GV_ID=10): Trợ giảng CSDL (10)
(10, 10, 'TROGIANG');