import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT dk.*, u.hoten, k.tenkhoa
      FROM dangkykhoa dk
      JOIN hocvien h ON dk.hv_id = h.user_id
      JOIN "User" u ON h.user_id = u.user_id
      JOIN khoadaotao k ON dk.kdt_id = k.kdt_id
      ORDER BY dk.ngaydk DESC
    `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { hv_id, kdt_id, ngaydk, trangthai } = req.body;
        const result = await pool.query(
            'INSERT INTO dangkykhoa (hv_id, kdt_id, ngaydk, trangthai) VALUES ($1, $2, $3, $4) RETURNING *',
            [hv_id, kdt_id, ngaydk, trangthai]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:hv_id/:kdt_id', async (req, res) => {
    try {
        const { hv_id, kdt_id } = req.params;
        const { ngaydk, trangthai } = req.body;
        const result = await pool.query(
            'UPDATE dangkykhoa SET ngaydk = $1, trangthai = $2 WHERE hv_id = $3 AND kdt_id = $4 RETURNING *',
            [ngaydk, trangthai, hv_id, kdt_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:hv_id/:kdt_id', async (req, res) => {
    try {
        const { hv_id, kdt_id } = req.params;
        const result = await pool.query('DELETE FROM dangkykhoa WHERE hv_id = $1 AND kdt_id = $2 RETURNING *', [hv_id, kdt_id]);
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
