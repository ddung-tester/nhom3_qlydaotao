import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT dt.*, u.hoten, u.email, l.lopmh_id, m.tenmh, k.tenkhoa
      FROM diemthi dt
      JOIN hocvien h ON dt.hv_id = h.user_id
      JOIN "User" u ON h.user_id = u.user_id
      JOIN lopmonhoc l ON dt.lopmh_id = l.lopmh_id
      LEFT JOIN monhoc m ON l.mh_ma = m.mh_ma
      LEFT JOIN khoadaotao k ON l.kdt_id = k.kdt_id
      ORDER BY dt.ngaythi DESC
    `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { hv_id, lopmh_id, lanthi, diem, ngaythi } = req.body;
        const result = await pool.query(
            'INSERT INTO diemthi (hv_id, lopmh_id, lanthi, diem, ngaythi) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [hv_id, lopmh_id, lanthi, diem, ngaythi]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:hv_id/:lopmh_id/:lanthi', async (req, res) => {
    try {
        const { hv_id, lopmh_id, lanthi } = req.params;
        const { diem, ngaythi } = req.body;
        const result = await pool.query(
            'UPDATE diemthi SET diem = $1, ngaythi = $2 WHERE hv_id = $3 AND lopmh_id = $4 AND lanthi = $5 RETURNING *',
            [diem, ngaythi, hv_id, lopmh_id, lanthi]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:hv_id/:lopmh_id/:lanthi', async (req, res) => {
    try {
        const { hv_id, lopmh_id, lanthi } = req.params;
        const result = await pool.query(
            'DELETE FROM diemthi WHERE hv_id = $1 AND lopmh_id = $2 AND lanthi = $3 RETURNING *',
            [hv_id, lopmh_id, lanthi]
        );
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
