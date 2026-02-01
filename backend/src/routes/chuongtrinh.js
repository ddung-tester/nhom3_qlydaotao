import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all chương trình
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT c.CT_ID AS ct_id, c.TenCT AS tenct, c.MoTa AS mota, c.NV_QuanLy_ID AS nv_quanly_id,
        u.HoTen as ten_nv_quanly
      FROM ChuongTrinh c
      LEFT JOIN NhanVien nv ON c.NV_QuanLy_ID = nv.USER_ID
      LEFT JOIN "User" u ON nv.USER_ID = u.USER_ID
      ORDER BY c.CT_ID DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi GET /chuongtrinh:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET one chương trình
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT CT_ID AS ct_id, TenCT AS tenct, MoTa AS mota, NV_QuanLy_ID AS nv_quanly_id FROM ChuongTrinh WHERE CT_ID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy chương trình' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi GET /chuongtrinh/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Tạo chương trình mới
router.post('/', async (req, res) => {
    try {
        const { tenct, mota, nv_quanly_id } = req.body;
        const result = await pool.query(
            'INSERT INTO ChuongTrinh (TenCT, MoTa, NV_QuanLy_ID) VALUES ($1, $2, $3) RETURNING CT_ID AS ct_id, TenCT AS tenct, MoTa AS mota, NV_QuanLy_ID AS nv_quanly_id',
            [tenct, mota, nv_quanly_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi POST /chuongtrinh:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT - Cập nhật chương trình
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { tenct, mota, nv_quanly_id } = req.body;
        const result = await pool.query(
            'UPDATE ChuongTrinh SET TenCT = $1, MoTa = $2, NV_QuanLy_ID = $3 WHERE CT_ID = $4 RETURNING CT_ID AS ct_id, TenCT AS tenct, MoTa AS mota, NV_QuanLy_ID AS nv_quanly_id',
            [tenct, mota, nv_quanly_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy chương trình' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi PUT /chuongtrinh/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Xóa chương trình
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM ChuongTrinh WHERE CT_ID = $1 RETURNING CT_ID AS ct_id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy chương trình' });
        }
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        console.error('Lỗi DELETE /chuongtrinh/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
