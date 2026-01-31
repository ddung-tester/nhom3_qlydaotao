import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Report 1: Kết quả học tập học viên (chỉ các khóa đã hoàn thành)
router.get('/student-results', async (req, res) => {
  try {
    console.log('=== DEBUG: /api/reports/student-results ===');

    const query = `
      SELECT 
        h.user_id as hv_id,
        u.hoten,
        u.email,
        k.kdt_id,
        k.tenkhoa,
        m.tenmh,
        MAX(dt.diem) as diem_cao_nhat
      FROM hocvien h
      JOIN "User" u ON h.user_id = u.user_id
      JOIN dangkykhoa dk ON h.user_id = dk.hv_id
      JOIN khoadaotao k ON dk.kdt_id = k.kdt_id
      LEFT JOIN lopmonhoc lmh ON k.kdt_id = lmh.kdt_id
      LEFT JOIN monhoc m ON lmh.mh_ma = m.mh_ma
      LEFT JOIN diemthi dt ON h.user_id = dt.hv_id AND lmh.lopmh_id = dt.lopmh_id
      GROUP BY h.user_id, u.hoten, u.email, k.kdt_id, k.tenkhoa, m.tenmh
      HAVING MAX(dt.diem) > 4
      ORDER BY u.hoten, k.tenkhoa, m.tenmh
    `;

    console.log('Executing query...');
    const result = await pool.query(query);
    console.log(`Query returned ${result.rows.length} rows`);

    if (result.rows.length > 0) {
      console.log('Sample data:', JSON.stringify(result.rows[0], null, 2));
    } else {
      console.log('⚠️ WARNING: No data returned');
      console.log('Checking for students with HOAN_THANH status...');
      const checkQuery = 'SELECT hv_id, kdt_id, trangthai FROM dangkykhoa';
      const checkResult = await pool.query(checkQuery);
      console.log('All dangkykhoa records:', checkResult.rows);
    }

    res.json(result.rows);
  } catch (error) {
    console.error('❌ ERROR in /reports/student-results:', error);
    res.status(500).json({ error: error.message });
  }
});

// Report 2: Tất cả học viên chưa hoàn thành khóa
router.get('/incomplete-students', async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT
        h.user_id as hv_id,
        u.hoten,
        u.email,
        k.tenkhoa,
        m.tenmh,
        MAX(dt.diem) as diem_cao_nhat
      FROM hocvien h
      JOIN "User" u ON h.user_id = u.user_id
      JOIN dangkykhoa dk ON h.user_id = dk.hv_id
      JOIN khoadaotao k ON dk.kdt_id = k.kdt_id
      JOIN lopmonhoc lmh ON dk.kdt_id = lmh.kdt_id
      JOIN monhoc m ON lmh.mh_ma = m.mh_ma
      LEFT JOIN diemthi dt ON h.user_id = dt.hv_id AND lmh.lopmh_id = dt.lopmh_id
      WHERE dt.diem IS NULL OR dt.diem < 5
      GROUP BY h.user_id, u.hoten, u.email, k.tenkhoa, m.tenmh
      ORDER BY u.hoten, k.tenkhoa, m.tenmh
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Lỗi /reports/incomplete-students:', error);
    res.status(500).json({ error: error.message });
  }
});

// Report 3: Tính lương giảng viên (tất cả thời gian)
router.get('/teacher-payroll', async (req, res) => {
  try {
    const rate_ta = 200000; // Đơn giá mặc định

    const query = `
      WITH luong_theo_vaitro AS (
        SELECT 
          g.user_id,
          pc.vaitro,
          COUNT(DISTINCT b.buoihoc_id) * 2 as gio,
          CASE 
            WHEN pc.vaitro = 'TROGIANG' THEN COUNT(DISTINCT b.buoihoc_id) * 2 * $1
            WHEN pc.vaitro = 'GIANGVIEN' THEN COUNT(DISTINCT b.buoihoc_id) * 2 * $1 * 2
            ELSE 0
          END as luong
        FROM giangvien g
        JOIN phancong pc ON g.user_id = pc.gv_id
        JOIN xeplich xl ON pc.lopmh_id = xl.lopmh_id
        JOIN buoihoc b ON xl.buoihoc_id = b.buoihoc_id
        GROUP BY g.user_id, pc.vaitro
      ),
      tong_luong_gv AS (
        SELECT 
          user_id,
          SUM(luong) as tong_luong
        FROM luong_theo_vaitro
        GROUP BY user_id
      )
      SELECT 
        g.user_id as gv_id,
        u.hoten as ten_gv,
        u.email,
        g.chuyenmon,
        lv.vaitro,
        lv.gio as tong_gio,
        lv.luong,
        tl.tong_luong as tong_luong_gv
      FROM giangvien g
      JOIN "User" u ON g.user_id = u.user_id
      JOIN luong_theo_vaitro lv ON g.user_id = lv.user_id
      JOIN tong_luong_gv tl ON g.user_id = tl.user_id
      ORDER BY u.hoten
    `;

    const result = await pool.query(query, [rate_ta]);
    res.json(result.rows);
  } catch (error) {
    console.error('Lỗi /reports/teacher-payroll:', error);
    res.status(500).json({ error: error.message });
  }
});

// Report 4: Tính lương nhân viên (Tự động hiển thị)
router.get('/staff-payroll', async (req, res) => {
  try {
    const rate_per_student = req.query.rate_per_student || 500000;
    const base_salary = req.query.base_salary || 5000000;

    const query = `
      SELECT 
        n.user_id as nv_id,
        u.hoten,
        u.email,
        $2::numeric as luong_cung,
        -- Số học viên của các chương trình nhân viên này quản lý
        COALESCE(sub_students.total_hv, 0) as so_hv_ql,
        -- Lương quản lý chương trình = số học viên * đơn giá
        COALESCE(sub_students.total_hv, 0) * $1::numeric as luong_ql_chuongtrinh,
        -- Số nhân viên dưới quyền (không tính tự quản lý)
        COALESCE(sub_staff.total_nv, 0) as so_nv_ql,
        -- Phụ cấp quản lý = 5% lương cứng * số nhân viên cấp dưới
        COALESCE(sub_staff.total_nv, 0) * ($2::numeric * 0.05) as phucap_ql_nhanvien,
        -- Tổng lương
        ($2::numeric) + 
        (COALESCE(sub_students.total_hv, 0) * $1::numeric) + 
        (COALESCE(sub_staff.total_nv, 0) * ($2::numeric * 0.05)) as tong_luong
      FROM nhanvien n
      JOIN "User" u ON n.user_id = u.user_id
      LEFT JOIN (
          SELECT ct.nv_quanly_id, COUNT(DISTINCT dk.hv_id) as total_hv
          FROM chuongtrinh ct
          JOIN khoadaotao kdt ON ct.ct_id = kdt.ct_id
          JOIN dangkykhoa dk ON kdt.kdt_id = dk.kdt_id
          GROUP BY ct.nv_quanly_id
      ) sub_students ON n.user_id = sub_students.nv_quanly_id
      LEFT JOIN (
          SELECT quanly_id, COUNT(user_id) as total_nv
          FROM nhanvien
          WHERE user_id != quanly_id
          GROUP BY quanly_id
      ) sub_staff ON n.user_id = sub_staff.quanly_id
      ORDER BY u.hoten
    `;

    const result = await pool.query(query, [rate_per_student, base_salary]);
    res.json(result.rows);
  } catch (error) {
    console.error('Lỗi /reports/staff-payroll:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
