-- Test query để kiểm tra dữ liệu học viên đã hoàn thành khóa
-- Chạy trong PostgreSQL để xem có data không

-- 1. Kiểm tra học viên nào có trạng thái HOAN_THANH
SELECT 
    hv_id, 
    kdt_id, 
    ngaydk, 
    trangthai 
FROM dangkykhoa 
WHERE trangthai = 'HOAN_THANH';

-- 2. Kiểm tra full data như API
SELECT 
    h.user_id as hv_id,
    u.hoten,
    u.email,
    k.kdt_id,
    k.tenkhoa,
    m.tenmh,
    MAX(dt.diem) as diem_cao_nhat,
    dk.trangthai
FROM hocvien h
JOIN "User" u ON h.user_id = u.user_id
JOIN dangkykhoa dk ON h.user_id = dk.hv_id
JOIN khoadaotao k ON dk.kdt_id = k.kdt_id
LEFT JOIN lopmonhoc lmh ON k.kdt_id = lmh.kdt_id
LEFT JOIN monhoc m ON lmh.mh_ma = m.mh_ma
LEFT JOIN diemthi dt ON h.user_id = dt.hv_id AND lmh.lopmh_id = dt.lopmh_id
WHERE dk.trangthai = 'HOAN_THANH'
GROUP BY h.user_id, u.hoten, u.email, k.kdt_id, k.tenkhoa, m.tenmh, dk.trangthai
ORDER BY u.hoten, k.tenkhoa, m.tenmh;

-- 3. Kiểm tra tất cả trạng thái hiện có
SELECT DISTINCT trangthai FROM dangkykhoa;
