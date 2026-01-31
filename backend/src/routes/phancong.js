import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT pc.*, u.hoten as ten_gv, u.email as email_gv, g.chuyenmon, 
             l.lopmh_id, m.tenmh, k.tenkhoa
      FROM phancong pc
      JOIN giangvien g ON pc.gv_id = g.user_id
      JOIN "User" u ON g.user_id = u.user_id
      JOIN lopmonhoc l ON pc.lopmh_id = l.lopmh_id
      LEFT JOIN monhoc m ON l.mh_ma = m.mh_ma
      LEFT JOIN khoadaotao k ON l.kdt_id = k.kdt_id
      ORDER BY pc.pc_id DESC
    `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { gv_id, lopmh_id, vaitro } = req.body;
        const result = await pool.query(
            'INSERT INTO phancong (gv_id, lopmh_id, vaitro) VALUES ($1, $2, $3) RETURNING *',
            [gv_id, lopmh_id, vaitro]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { gv_id, lopmh_id, vaitro } = req.body;
        const result = await pool.query(
            'UPDATE phancong SET gv_id = $1, lopmh_id = $2, vaitro = $3 WHERE pc_id = $4 RETURNING *',
            [gv_id, lopmh_id, vaitro, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM phancong WHERE pc_id = $1 RETURNING *', [id]);
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
