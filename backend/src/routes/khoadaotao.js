import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET - Lấy tất cả khóa đào tạo
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT k.KDT_ID AS kdt_id, k.CT_ID AS ct_id, k.KY_ID AS ky_id, k.TenKhoa AS tenkhoa, k.NgayKhaiGiang AS ngaykhaigiang,
             c.TenCT AS tenct, ky.HocKy AS hocky, ky.Nam AS nam
      FROM KhoaDaoTao k
      LEFT JOIN ChuongTrinh c ON k.CT_ID = c.CT_ID
      LEFT JOIN KyHoc ky ON k.KY_ID = ky.KY_ID
      ORDER BY k.KDT_ID DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi GET /khoadaotao:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET - Lấy một khóa đào tạo
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT KDT_ID AS kdt_id, CT_ID AS ct_id, KY_ID AS ky_id, TenKhoa AS tenkhoa, NgayKhaiGiang AS ngaykhaigiang FROM KhoaDaoTao WHERE KDT_ID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy khóa đào tạo' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi GET /khoadaotao/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Tạo khóa đào tạo mới
router.post('/', async (req, res) => {
    try {
        const { ct_id, ky_id, tenkhoa, ngaykhaigiang } = req.body;
        const result = await pool.query(
            'INSERT INTO KhoaDaoTao (CT_ID, KY_ID, TenKhoa, NgayKhaiGiang) VALUES ($1, $2, $3, $4) RETURNING KDT_ID AS kdt_id, CT_ID AS ct_id, KY_ID AS ky_id, TenKhoa AS tenkhoa, NgayKhaiGiang AS ngaykhaigiang',
            [ct_id, ky_id, tenkhoa, ngaykhaigiang]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi POST /khoadaotao:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT - Cập nhật khóa đào tạo
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ct_id, ky_id, tenkhoa, ngaykhaigiang } = req.body;
        const result = await pool.query(
            'UPDATE KhoaDaoTao SET CT_ID = $1, KY_ID = $2, TenKhoa = $3, NgayKhaiGiang = $4 WHERE KDT_ID = $5 RETURNING KDT_ID AS kdt_id, CT_ID AS ct_id, KY_ID AS ky_id, TenKhoa AS tenkhoa, NgayKhaiGiang AS ngaykhaigiang',
            [ct_id, ky_id, tenkhoa, ngaykhaigiang, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy khóa đào tạo' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi PUT /khoadaotao/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Xóa khóa đào tạo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM KhoaDaoTao WHERE KDT_ID = $1 RETURNING KDT_ID AS kdt_id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy khóa đào tạo' });
        }
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        console.error('Lỗi DELETE /khoadaotao/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
