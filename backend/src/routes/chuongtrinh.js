import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all chương trình
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT c.*, u.hoten as ten_nv_quanly
      FROM chuongtrinh c
      LEFT JOIN nhanvien nv ON c.nv_quanly_id = nv.user_id
      LEFT JOIN "User" u ON nv.user_id = u.user_id
      ORDER BY c.ct_id DESC
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
        const result = await pool.query('SELECT * FROM chuongtrinh WHERE ct_id = $1', [id]);
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
            'INSERT INTO chuongtrinh (tenct, mota, nv_quanly_id) VALUES ($1, $2, $3) RETURNING *',
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
            'UPDATE chuongtrinh SET tenct = $1, mota = $2, nv_quanly_id = $3 WHERE ct_id = $4 RETURNING *',
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
        const result = await pool.query('DELETE FROM chuongtrinh WHERE ct_id = $1 RETURNING *', [id]);
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
