import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all môn học
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT m.*, c.tenct
      FROM monhoc m
      LEFT JOIN chuongtrinh c ON m.ct_id = c.ct_id
      ORDER BY m.mh_ma
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi GET /monhoc:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET one môn học
router.get('/:ma', async (req, res) => {
    try {
        const { ma } = req.params;
        const result = await pool.query('SELECT * FROM monhoc WHERE mh_ma = $1', [ma]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy môn học' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi GET /monhoc/:ma:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Tạo môn học mới
router.post('/', async (req, res) => {
    try {
        const { mh_ma, ct_id, tenmh, sogio } = req.body;
        const result = await pool.query(
            'INSERT INTO monhoc (mh_ma, ct_id, tenmh, sogio) VALUES ($1, $2, $3, $4) RETURNING *',
            [mh_ma, ct_id, tenmh, sogio]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi POST /monhoc:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT - Cập nhật môn học
router.put('/:ma', async (req, res) => {
    try {
        const { ma } = req.params;
        const { ct_id, tenmh, sogio } = req.body;
        const result = await pool.query(
            'UPDATE monhoc SET ct_id = $1, tenmh = $2, sogio = $3 WHERE mh_ma = $4 RETURNING *',
            [ct_id, tenmh, sogio, ma]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy môn học' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi PUT /monhoc/:ma:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Xóa môn học
router.delete('/:ma', async (req, res) => {
    try {
        const { ma } = req.params;
        const result = await pool.query('DELETE FROM monhoc WHERE mh_ma = $1 RETURNING *', [ma]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy môn học' });
        }
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        console.error('Lỗi DELETE /monhoc/:ma:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
