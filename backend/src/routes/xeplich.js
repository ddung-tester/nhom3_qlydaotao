import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT x.*, b.ngayhoc, b.giobd, b.giokt, l.lopmh_id, p.maphong, 
             m.tenmh, k.tenkhoa
      FROM xeplich x
      JOIN buoihoc b ON x.buoihoc_id = b.buoihoc_id
      JOIN lopmonhoc l ON x.lopmh_id = l.lopmh_id
      JOIN phonghoc p ON x.ph_id = p.ph_id
      LEFT JOIN monhoc m ON l.mh_ma = m.mh_ma
      LEFT JOIN khoadaotao k ON l.kdt_id = k.kdt_id
      ORDER BY b.ngayhoc DESC
    `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { buoihoc_id, lopmh_id, ph_id } = req.body;
        const result = await pool.query(
            'INSERT INTO xeplich (buoihoc_id, lopmh_id, ph_id) VALUES ($1, $2, $3) RETURNING *',
            [buoihoc_id, lopmh_id, ph_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:buoihoc_id', async (req, res) => {
    try {
        const { buoihoc_id } = req.params;
        const { lopmh_id, ph_id } = req.body;
        const result = await pool.query(
            'UPDATE xeplich SET lopmh_id = $1, ph_id = $2 WHERE buoihoc_id = $3 RETURNING *',
            [lopmh_id, ph_id, buoihoc_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:buoihoc_id', async (req, res) => {
    try {
        const { buoihoc_id } = req.params;
        const result = await pool.query('DELETE FROM xeplich WHERE buoihoc_id = $1 RETURNING *', [buoihoc_id]);
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
