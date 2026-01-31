import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all lớp môn học
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT l.*, k.tenkhoa, m.tenmh
      FROM lopmonhoc l
      LEFT JOIN khoadaotao k ON l.kdt_id = k.kdt_id
      LEFT JOIN monhoc m ON l.mh_ma = m.mh_ma
      ORDER BY l.lopmh_id DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi GET /lopmonhoc:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET one lớp môn học
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM lopmonhoc WHERE lopmh_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy lớp môn học' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi GET /lopmonhoc/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Tạo lớp môn học mới
router.post('/', async (req, res) => {
    try {
        const { kdt_id, mh_ma } = req.body;
        const result = await pool.query(
            'INSERT INTO lopmonhoc (kdt_id, mh_ma) VALUES ($1, $2) RETURNING *',
            [kdt_id, mh_ma]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi POST /lopmonhoc:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT - Cập nhật lớp môn học
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { kdt_id, mh_ma } = req.body;
        const result = await pool.query(
            'UPDATE lopmonhoc SET kdt_id = $1, mh_ma = $2 WHERE lopmh_id = $3 RETURNING *',
            [kdt_id, mh_ma, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy lớp môn học' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi PUT /lopmonhoc/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Xóa lớp môn học
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM lopmonhoc WHERE lopmh_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy lớp môn học' });
        }
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        console.error('Lỗi DELETE /lopmonhoc/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
