import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all kỳ học
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT KY_ID AS ky_id, HocKy AS hocky, Nam AS nam, NgayBatDau AS ngaybatdau, NgayKetThuc AS ngayketthuc FROM KyHoc ORDER BY Nam DESC, HocKy DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi GET /kyhoc:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET one kỳ học
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT KY_ID AS ky_id, HocKy AS hocky, Nam AS nam, NgayBatDau AS ngaybatdau, NgayKetThuc AS ngayketthuc FROM KyHoc WHERE KY_ID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy kỳ học' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi GET /kyhoc/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Tạo kỳ học mới
router.post('/', async (req, res) => {
    try {
        const { hocky, nam, ngaybatdau, ngayketthuc } = req.body;
        const result = await pool.query(
            'INSERT INTO KyHoc (HocKy, Nam, NgayBatDau, NgayKetThuc) VALUES ($1, $2, $3, $4) RETURNING KY_ID AS ky_id, HocKy AS hocky, Nam AS nam, NgayBatDau AS ngaybatdau, NgayKetThuc AS ngayketthuc',
            [hocky, nam, ngaybatdau, ngayketthuc]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi POST /kyhoc:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT - Cập nhật kỳ học
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { hocky, nam, ngaybatdau, ngayketthuc } = req.body;
        const result = await pool.query(
            'UPDATE KyHoc SET HocKy = $1, Nam = $2, NgayBatDau = $3, NgayKetThuc = $4 WHERE KY_ID = $5 RETURNING KY_ID AS ky_id, HocKy AS hocky, Nam AS nam, NgayBatDau AS ngaybatdau, NgayKetThuc AS ngayketthuc',
            [hocky, nam, ngaybatdau, ngayketthuc, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy kỳ học' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi PUT /kyhoc/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Xóa kỳ học
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM KyHoc WHERE KY_ID = $1 RETURNING KY_ID AS ky_id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy kỳ học' });
        }
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        console.error('Lỗi DELETE /kyhoc/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
