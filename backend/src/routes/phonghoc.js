import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT PH_ID AS ph_id, DiaDiem AS diadiem, MaPhong AS maphong FROM PhongHoc ORDER BY PH_ID');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT PH_ID AS ph_id, DiaDiem AS diadiem, MaPhong AS maphong FROM PhongHoc WHERE PH_ID = $1', [id]);
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
            'INSERT INTO PhongHoc (DiaDiem, MaPhong) VALUES ($1, $2) RETURNING PH_ID AS ph_id, DiaDiem AS diadiem, MaPhong AS maphong',
            [diadiem, maphong]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi POST /phonghoc:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { diadiem, maphong } = req.body;
        const result = await pool.query(
            'UPDATE PhongHoc SET DiaDiem = $1, MaPhong = $2 WHERE PH_ID = $3 RETURNING PH_ID AS ph_id, DiaDiem AS diadiem, MaPhong AS maphong',
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
        const result = await pool.query('DELETE FROM PhongHoc WHERE PH_ID = $1 RETURNING PH_ID AS ph_id', [id]);
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
