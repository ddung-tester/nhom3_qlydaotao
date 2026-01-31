import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM phonghoc ORDER BY ph_id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM phonghoc WHERE ph_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { diadiem, maphong } = req.body;
        const result = await pool.query(
            'INSERT INTO phonghoc (diadiem, maphong) VALUES ($1, $2) RETURNING *',
            [diadiem, maphong]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { diadiem, maphong } = req.body;
        const result = await pool.query(
            'UPDATE phonghoc SET diadiem = $1, maphong = $2 WHERE ph_id = $3 RETURNING *',
            [diadiem, maphong, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM phonghoc WHERE ph_id = $1 RETURNING *', [id]);
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
