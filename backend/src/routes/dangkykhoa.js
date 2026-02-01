import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET - Lấy danh sách đăng ký khóa
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT dk.HV_ID AS hv_id, dk.KDT_ID AS kdt_id, dk.NgayDK AS ngaydk, dk.TrangThai AS trangthai,
             u.HoTen AS hoten, k.TenKhoa AS tenkhoa
      FROM DangKyKhoa dk
      JOIN HocVien h ON dk.HV_ID = h.USER_ID
      JOIN "User" u ON h.USER_ID = u.USER_ID
      JOIN KhoaDaoTao k ON dk.KDT_ID = k.KDT_ID
      ORDER BY dk.NgayDK DESC
    `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Đăng ký khóa mới
router.post('/', async (req, res) => {
    try {
        const { hv_id, kdt_id, ngaydk, trangthai } = req.body;
        const result = await pool.query(
            'INSERT INTO DangKyKhoa (HV_ID, KDT_ID, NgayDK, TrangThai) VALUES ($1, $2, $3, $4) RETURNING HV_ID AS hv_id, KDT_ID AS kdt_id, NgayDK AS ngaydk, TrangThai AS trangthai',
            [hv_id, kdt_id, ngaydk, trangthai]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Cập nhật thông tin đăng ký
router.put('/:hv_id/:kdt_id', async (req, res) => {
    try {
        const { hv_id, kdt_id } = req.params;
        const { ngaydk, trangthai } = req.body;
        const result = await pool.query(
            'UPDATE DangKyKhoa SET NgayDK = $1, TrangThai = $2 WHERE HV_ID = $3 AND KDT_ID = $4 RETURNING HV_ID AS hv_id, KDT_ID AS kdt_id, NgayDK AS ngaydk, TrangThai AS trangthai',
            [ngaydk, trangthai, hv_id, kdt_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Xóa đăng ký khóa
router.delete('/:hv_id/:kdt_id', async (req, res) => {
    try {
        const { hv_id, kdt_id } = req.params;
        const result = await pool.query('DELETE FROM DangKyKhoa WHERE HV_ID = $1 AND KDT_ID = $2 RETURNING HV_ID AS hv_id, KDT_ID AS kdt_id', [hv_id, kdt_id]);
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
