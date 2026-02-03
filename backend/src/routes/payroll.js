import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Hằng số cấu hình
const BASE_SALARY = 5000000;
const SUBORDINATE_BONUS_PERCENT = 0.05;
const DEFAULT_STUDENT_RATE = 100000; // Mức mặc định nếu không nhập

// Hàm hỗ trợ đọc định dạng YYYY-MM
const parseMonthParam = (monthStr) => {
    if (!monthStr || !/^\d{4}-\d{2}$/.test(monthStr)) {
        const now = new Date();
        const m = (now.getMonth() + 1).toString().padStart(2, '0');
        return [`${now.getFullYear()}-${m}`, now.getFullYear(), now.getMonth() + 1];
    }
    const [y, m] = monthStr.split('-');
    return [monthStr, parseInt(y), parseInt(m)];
};

// GET /api/payroll?month=YYYY-MM
router.get('/', async (req, res) => {
    try {
        const { month, studentRate } = req.query;
        const [monthStr, yearVal, monthVal] = parseMonthParam(month);

        // Ưu tiên: Tham số Query > Hằng số mặc định
        const rateVal = studentRate ? parseFloat(studentRate) : DEFAULT_STUDENT_RATE;

        // Tính ngày chốt (Ngày 1 của tháng tiếp theo)
        let nextMonth = monthVal + 1;
        let nextYear = yearVal;
        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear += 1;
        }
        const cutoffDate = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;

        const query = `
            WITH params AS (
                SELECT $1::NUMERIC AS luong_cung,
                       $2::NUMERIC AS luong_ql_moi_hoc_vien,
                       $3::DATE AS ngay_chot,
                       $4::NUMERIC AS phan_tram_phu_cap
            ),
            headcount AS (
                SELECT QuanLy_ID AS ql_id, COUNT(*) AS so_nv_duoi_quyen
                FROM NhanVien nv
                CROSS JOIN params p
                WHERE nv.NgayVaoLam < p.ngay_chot
                GROUP BY QuanLy_ID
            ),
            students_per_nv AS (
                SELECT ct.NV_QuanLy_ID AS nv_id, COUNT(DISTINCT (ct.CT_ID, dk.HV_ID)) AS so_hv
                FROM ChuongTrinh ct
                JOIN KhoaDaoTao kdt ON kdt.CT_ID = ct.CT_ID
                LEFT JOIN DangKyKhoa dk ON dk.KDT_ID = kdt.KDT_ID 
                     AND dk.TrangThai != 'HUY'
                CROSS JOIN params p
                WHERE dk.NgayDK < p.ngay_chot
                GROUP BY ct.NV_QuanLy_ID
            )
            SELECT 
                u.USER_ID AS nv_id, 
                u.HoTen,
                p.luong_cung AS base_salary,
                
                -- Lương quản lý chương trình
                COALESCE(spn.so_hv, 0) AS student_count,
                COALESCE(spn.so_hv, 0) * p.luong_ql_moi_hoc_vien AS mgmt_program_salary,
                
                -- Thưởng quản lý nhân viên
                COALESCE(hc.so_nv_duoi_quyen, 0) AS subordinate_count,
                (p.luong_cung * p.phan_tram_phu_cap * COALESCE(hc.so_nv_duoi_quyen, 0)) AS subordinate_bonus,
                
                -- Tổng lương
                (
                    p.luong_cung 
                    + (COALESCE(spn.so_hv, 0) * p.luong_ql_moi_hoc_vien)
                    + (p.luong_cung * p.phan_tram_phu_cap * COALESCE(hc.so_nv_duoi_quyen, 0))
                ) AS total_salary
                
            FROM NhanVien n
            JOIN "User" u ON u.USER_ID = n.USER_ID
            CROSS JOIN params p
            LEFT JOIN students_per_nv spn ON spn.nv_id = n.USER_ID
            LEFT JOIN headcount hc ON hc.ql_id = n.USER_ID
            WHERE n.NgayVaoLam < p.ngay_chot
            ORDER BY total_salary DESC, u.HoTen;
        `;

        const result = await pool.query(query, [
            BASE_SALARY,
            rateVal,
            cutoffDate,
            SUBORDINATE_BONUS_PERCENT
        ]);

        res.json({
            month: monthStr,
            config: {
                base_salary: BASE_SALARY,
                student_rate: rateVal,
                subordinate_bonus_percent: SUBORDINATE_BONUS_PERCENT
            },
            data: result.rows
        });

    } catch (error) {
        console.error('Error /api/payroll:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

export default router;
