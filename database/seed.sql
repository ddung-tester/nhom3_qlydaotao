-- Seed data cho hệ thống quản lý trung tâm đào tạo

-- 1. Nhân viên (3 nhân viên, người đầu tiên tự quản lý)
INSERT INTO "User" (hoten, ngaysinh, email) VALUES
('Nguyễn Văn An', '1985-05-15', 'nva@example.com'),
('Trần Thị Bình', '1987-08-20', 'ttb@example.com'),
('Lê Văn Cường', '1990-03-10', 'lvc@example.com');

INSERT INTO user_sdt (user_id, sdt) VALUES
(1, '0901234567'),
(1, '0987654321'),
(2, '0912345678'),
(3, '0923456789');

-- NV1 đứng đầu (không quản lý), NV2 và NV3 do NV1 quản lý
INSERT INTO nhanvien (user_id, ngayvaolam, quanly_id) VALUES
(1, '2020-01-01', NULL),
(2, '2020-06-15', 1),
(3, '2021-01-10', 1);

-- 2. Chương trình đào tạo (2 chương trình)
INSERT INTO chuongtrinh (tenct, mota, nv_quanly_id) VALUES
('Lập trình Web Full-Stack', 'Khóa học lập trình web từ cơ bản đến nâng cao', 1),
('Data Science & AI', 'Khóa học khoa học dữ liệu và trí tuệ nhân tạo', 2);

-- 3. Môn học
INSERT INTO monhoc (mh_ma, ct_id, tenmh, sogio) VALUES
('WEB101', 1, 'HTML/CSS Cơ bản', 40),
('WEB102', 1, 'JavaScript', 60),
('WEB103', 1, 'React Framework', 80),
('WEB104', 1, 'Node.js & Express', 60),
('DS101', 2, 'Python Cơ bản', 40),
('DS102', 2, 'Machine Learning', 80),
('DS103', 2, 'Deep Learning', 80);

-- 4. Kỳ học
INSERT INTO kyhoc (hocky, nam, ngaybatdau, ngayketthuc) VALUES
('HK1', 2024, '2024-01-15', '2024-05-31'),
('HK2', 2024, '2024-06-01', '2024-10-31');

-- 5. Khóa đào tạo
INSERT INTO khoadaotao (ct_id, ky_id, tenkhoa, ngaykhaigiang) VALUES
(1, 1, 'Web Full-Stack K01', '2024-01-20'),
(2, 2, 'Data Science K01', '2024-06-10');

-- 6. Lớp môn học
INSERT INTO lopmonhoc (kdt_id, mh_ma) VALUES
-- Khóa Web Full-Stack K01
(1, 'WEB101'),
(1, 'WEB102'),
(1, 'WEB103'),
(1, 'WEB104'),
-- Khóa Data Science K01
(2, 'DS101'),
(2, 'DS102'),
(2, 'DS103');

-- 7. Giảng viên (2 giảng viên)
INSERT INTO "User" (hoten, ngaysinh, email) VALUES
('Phạm Minh Đức', '1988-07-12', 'pmd@example.com'),
('Hoàng Thị Lan', '1992-11-25', 'htl@example.com');

INSERT INTO user_sdt (user_id, sdt) VALUES
(4, '0934567890'),
(5, '0945678901');

INSERT INTO giangvien (user_id, chuyenmon) VALUES
(4, 'Web Development'),
(5, 'Data Science & AI');

-- 8. Phân công giảng viên
INSERT INTO phancong (gv_id, lopmh_id, vaitro) VALUES
-- GV1 (Phạm Minh Đức) dạy các môn Web
(4, 1, 'GIANGVIEN'),
(4, 2, 'GIANGVIEN'),
(4, 3, 'GIANGVIEN'),
(4, 4, 'TROGIANG'),
-- GV2 (Hoàng Thị Lan) dạy các môn Data Science
(5, 5, 'GIANGVIEN'),
(5, 6, 'GIANGVIEN'),
(5, 7, 'TROGIANG');

-- 9. Buổi học (ví dụ tháng 1/2024)
INSERT INTO buoihoc (ngayhoc, giobd, giokt) VALUES
('2024-01-22', '08:00', '10:00'),
('2024-01-24', '08:00', '10:00'),
('2024-01-26', '08:00', '10:00'),
('2024-01-29', '13:00', '15:00'),
('2024-01-31', '13:00', '15:00');

-- 10. Phòng học
INSERT INTO phonghoc (diadiem, maphong) VALUES
('Tầng 1, Tòa A', 'A101'),
('Tầng 2, Tòa A', 'A201'),
('Tầng 1, Tòa B', 'B101');

-- 11. Xếp lịch
INSERT INTO xeplich (buoihoc_id, lopmh_id, ph_id) VALUES
(1, 1, 1), -- WEB101 tại A101
(2, 1, 1),
(3, 2, 2), -- WEB102 tại A201
(4, 5, 3), -- DS101 tại B101
(5, 5, 3);

-- 12. Học viên
INSERT INTO "User" (hoten, ngaysinh, email) VALUES
('Vũ Thị Hoa', '2000-03-15', 'vth@example.com'),
('Đinh Văn Khoa', '1999-08-22', 'dvk@example.com'),
('Phan Thị Mai', '2001-01-10', 'ptm@example.com');

INSERT INTO user_sdt (user_id, sdt) VALUES
(6, '0956789012'),
(7, '0967890123'),
(8, '0978901234');

INSERT INTO hocvien (user_id, diachi) VALUES
(6, '123 Đường Lê Lợi, Q.1, TP.HCM'),
(7, '456 Đường Nguyễn Huệ, Q.1, TP.HCM'),
(8, '789 Đường Trần Hưng Đạo, Q.5, TP.HCM');

-- 13. Đăng ký khóa
INSERT INTO dangkykhoa (hv_id, kdt_id, ngaydk, trangthai) VALUES
(6, 1, '2024-01-10', 'HOAN_THANH'),
(7, 1, '2024-01-11', 'DANG_HOC'),
(8, 2, '2024-06-05', 'DANG_HOC');

-- 14. Điểm thi
-- Học viên 6 (Vũ Thị Hoa) - đã hoàn thành khóa Web
INSERT INTO diemthi (hv_id, lopmh_id, lanthi, diem, ngaythi) VALUES
(6, 1, 1, 8.5, '2024-02-15'),
(6, 2, 1, 7.0, '2024-03-20'),
(6, 2, 2, 8.0, '2024-04-10'),
(6, 3, 1, 9.0, '2024-04-25'),
(6, 4, 1, 7.5, '2024-05-20');

-- Học viên 7 (Đinh Văn Khoa) - đang học, có môn chưa đạt
INSERT INTO diemthi (hv_id, lopmh_id, lanthi, diem, ngaythi) VALUES
(7, 1, 1, 6.5, '2024-02-15'),
(7, 2, 1, 4.0, '2024-03-20'),
(7, 2, 2, 5.0, '2024-04-10');
