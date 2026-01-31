import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM buoihoc ORDER BY ngayhoc DESC, giobd');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM buoihoc WHERE buoihoc_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { ngayhoc, giobd, giokt } = req.body;
        const result = await pool.query(
            'INSERT INTO buoihoc (ngayhoc, giobd, giokt) VALUES ($1, $2, $3) RETURNING *',
            [ngayhoc, giobd, giokt]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ngayhoc, giobd, giokt } = req.body;
        const result = await pool.query(
            'UPDATE buoihoc SET ngayhoc = $1, giobd = $2, giokt = $3 WHERE buoihoc_id = $4 RETURNING *',
            [ngayhoc, giobd, giokt, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM buoihoc WHERE buoihoc_id = $1 RETURNING *', [id]);
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
