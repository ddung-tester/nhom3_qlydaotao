import express from 'express';
import pool from '../db.js';

const router = express.Router();

// ============================================================================
// 5.2.2. Student Results (Completed Cohorts Only)
// ============================================================================
router.get('/student-results', async (req, res) => {
  try {
    const query = `
      WITH best_score AS (
        SELECT
          dt.HV_ID,
          lm.KDT_ID,
          dt.LopMH_ID,
          MAX(dt.Diem) AS diem_cao_nhat
        FROM DiemThi dt
        JOIN LopMonHoc lm ON lm.LopMH_ID = dt.LopMH_ID
        GROUP BY dt.HV_ID, lm.KDT_ID, dt.LopMH_ID
      ),
      course_avg AS (
        SELECT
          bs.HV_ID,
          bs.KDT_ID,
          ROUND(AVG(bs.diem_cao_nhat)::numeric, 2) AS diem_tb_khoa
        FROM best_score bs
        GROUP BY bs.HV_ID, bs.KDT_ID
      )
      SELECT
        u.USER_ID AS hv_id,
        u.HoTen,
        kdt.TenKhoa,
        ct.TenCT,
        kh.HocKy,
        kh.Nam,
        mh.MH_MA,
        mh.TenMH,
        bs.diem_cao_nhat,
        ca.diem_tb_khoa
      FROM DangKyKhoa dk
      JOIN "User" u          ON u.USER_ID = dk.HV_ID
      JOIN KhoaDaoTao kdt    ON kdt.KDT_ID = dk.KDT_ID
      JOIN ChuongTrinh ct    ON ct.CT_ID = kdt.CT_ID
      JOIN KyHoc kh          ON kh.KY_ID = kdt.KY_ID
      JOIN LopMonHoc lm      ON lm.KDT_ID = dk.KDT_ID
      JOIN MonHoc mh         ON mh.MH_MA = lm.MH_MA
      LEFT JOIN best_score bs
        ON bs.HV_ID = dk.HV_ID
       AND bs.KDT_ID = dk.KDT_ID
       AND bs.LopMH_ID = lm.LopMH_ID
      LEFT JOIN course_avg ca
        ON ca.HV_ID = dk.HV_ID
       AND ca.KDT_ID = dk.KDT_ID
      WHERE dk.TrangThai = 'HOAN_THANH'
      ORDER BY u.HoTen, kh.Nam, kh.HocKy, kdt.TenKhoa, mh.TenMH;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error /reports/student-results:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// 5.2.3. Incomplete Students with Failing Grades
// ============================================================================
router.get('/incomplete-students', async (req, res) => {
  try {
    const query = `
      WITH module_list AS (
        SELECT lm.KDT_ID, lm.LopMH_ID, mh.TenMH
        FROM LopMonHoc lm
        JOIN MonHoc mh ON mh.MH_MA = lm.MH_MA
      ),
      attempts AS (
        SELECT dt.HV_ID, lm.KDT_ID, dt.LopMH_ID, dt.LanThi, dt.Diem, dt.NgayThi
        FROM DiemThi dt
        JOIN LopMonHoc lm ON lm.LopMH_ID = dt.LopMH_ID
      ),
      pass_flag AS (
        SELECT HV_ID, KDT_ID, LopMH_ID,
               MAX(CASE WHEN Diem > 5 THEN 1 ELSE 0 END) AS da_qua
        FROM attempts
        GROUP BY HV_ID, KDT_ID, LopMH_ID
      )
      SELECT u.USER_ID AS hv_id, u.HoTen, ml.TenMH, a.LanThi, a.Diem, a.NgayThi
      FROM DangKyKhoa dk
      JOIN "User" u ON u.USER_ID = dk.HV_ID
      JOIN module_list ml ON ml.KDT_ID = dk.KDT_ID
      LEFT JOIN pass_flag pf
        ON pf.HV_ID = dk.HV_ID AND pf.KDT_ID = dk.KDT_ID AND pf.LopMH_ID = ml.LopMH_ID
      LEFT JOIN attempts a
        ON a.HV_ID = dk.HV_ID AND a.KDT_ID = dk.KDT_ID AND a.LopMH_ID = ml.LopMH_ID AND a.Diem <= 5
      WHERE dk.KDT_ID = 1 AND COALESCE(pf.da_qua, 0) = 0
      ORDER BY u.HoTen, ml.TenMH, a.LanThi;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error /reports/incomplete-students:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// 5.2.4. Teacher Payroll Calculation
// ============================================================================
router.get('/teacher-payroll', async (req, res) => {
  try {
    const { month, year } = req.query;
    const monthVal = month || '02';
    const yearVal = year || '2026';
    const bd = `${yearVal}-${monthVal}-01`;
    const kt = monthVal === '12'
      ? `${parseInt(yearVal) + 1}-01-01`
      : `${yearVal}-${(parseInt(monthVal) + 1).toString().padStart(2, '0')}-01`;

    const query = `
      WITH params AS (
        SELECT $1::DATE AS bd,
               $2::DATE AS kt,
               100000::NUMERIC AS luong_gio_tro_giang
      ),
      hours_by_role AS (
        SELECT pc.gv_id, pc.vaitro, COUNT(*) * 2 AS so_gio
        FROM phancong pc
        JOIN xeplich xl ON xl.lopmh_id = pc.lopmh_id
        JOIN buoihoc bh ON bh.buoihoc_id = xl.buoihoc_id
        JOIN params p ON bh.ngayhoc >= p.bd AND bh.ngayhoc < p.kt
        GROUP BY pc.gv_id, pc.vaitro
      ),
      agg AS (
        SELECT gv_id,
               SUM(CASE WHEN vaitro='GIANGVIEN' THEN so_gio ELSE 0 END) AS gio_gv,
               SUM(CASE WHEN vaitro='TROGIANG' THEN so_gio ELSE 0 END) AS gio_tg
        FROM hours_by_role
        GROUP BY gv_id
      )
      SELECT u.user_id AS gv_id, u.hoten,
             COALESCE(a.gio_gv,0) AS gio_giang_vien,
             COALESCE(a.gio_tg,0) AS gio_tro_giang,
             (COALESCE(a.gio_tg,0) * p.luong_gio_tro_giang)
             + (COALESCE(a.gio_gv,0) * p.luong_gio_tro_giang * 2) AS tong_luong
      FROM agg a
      JOIN "User" u ON u.user_id = a.gv_id
      CROSS JOIN params p
      ORDER BY tong_luong DESC, u.hoten;
    `;

    const result = await pool.query(query, [bd, kt]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error /reports/teacher-payroll:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// 5.2.5. Staff Payroll Calculation
// ============================================================================
router.get('/staff-payroll', async (req, res) => {
  try {
    const query = `
      WITH params AS (
        SELECT 5000000::NUMERIC AS luong_cung,
               20000::NUMERIC AS luong_ql_moi_hoc_vien
      ),
      headcount AS (
        SELECT QuanLy_ID AS ql_id, COUNT(*) AS so_nv_duoi_quyen
        FROM NhanVien
        GROUP BY QuanLy_ID
      ),
      students_per_nv AS (
        SELECT ct.NV_QuanLy_ID AS nv_id, COUNT(DISTINCT dk.HV_ID) AS so_hv
        FROM ChuongTrinh ct
        JOIN KhoaDaoTao kdt ON kdt.CT_ID = ct.CT_ID
        LEFT JOIN DangKyKhoa dk ON dk.KDT_ID = kdt.KDT_ID
        GROUP BY ct.NV_QuanLy_ID
      )
      SELECT u.USER_ID AS nv_id, u.HoTen,
             p.luong_cung,
             COALESCE(spn.so_hv, 0) AS so_hv_quan_ly,
             COALESCE(spn.so_hv, 0) * p.luong_ql_moi_hoc_vien AS luong_ql_ct,
             COALESCE(hc.so_nv_duoi_quyen, 0) AS so_nv_duoi_quyen,
             p.luong_cung * 0.05 * COALESCE(hc.so_nv_duoi_quyen, 0) AS phu_cap_ql_nv,
             p.luong_cung
             + COALESCE(spn.so_hv, 0) * p.luong_ql_moi_hoc_vien
             + p.luong_cung * 0.05 * COALESCE(hc.so_nv_duoi_quyen, 0) AS tong_luong
      FROM NhanVien n
      JOIN "User" u ON u.USER_ID = n.USER_ID
      CROSS JOIN params p
      LEFT JOIN students_per_nv spn ON spn.nv_id = n.USER_ID
      LEFT JOIN headcount hc ON hc.ql_id = n.USER_ID
      ORDER BY tong_luong DESC, u.HoTen;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error /reports/staff-payroll:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
