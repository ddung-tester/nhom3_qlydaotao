import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all khóa đào tạo
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT k.*, c.tenct, ky.hocky, ky.nam
      FROM khoadaotao k
      LEFT JOIN chuongtrinh c ON k.ct_id = c.ct_id
      LEFT JOIN kyhoc ky ON k.ky_id = ky.ky_id
      ORDER BY k.kdt_id DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi GET /khoadaotao:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET one khóa đào tạo
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM khoadaotao WHERE kdt_id = $1', [id]);
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
            'INSERT INTO khoadaotao (ct_id, ky_id, tenkhoa, ngaykhaigiang) VALUES ($1, $2, $3, $4) RETURNING *',
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
            'UPDATE khoadaotao SET ct_id = $1, ky_id = $2, tenkhoa = $3, ngaykhaigiang = $4 WHERE kdt_id = $5 RETURNING *',
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
        const result = await pool.query('DELETE FROM khoadaotao WHERE kdt_id = $1 RETURNING *', [id]);
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
