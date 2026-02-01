import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all lớp môn học
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT l.LopMH_ID AS lopmh_id, l.KDT_ID AS kdt_id, l.MH_MA AS mh_ma,
             k.TenKhoa AS tenkhoa, m.TenMH AS tenmh, c.TenCT AS tenct
      FROM LopMonHoc l
      LEFT JOIN KhoaDaoTao k ON l.KDT_ID = k.KDT_ID
      LEFT JOIN MonHoc m ON l.MH_MA = m.MH_MA
      LEFT JOIN ChuongTrinh c ON k.CT_ID = c.CT_ID
      ORDER BY l.LopMH_ID DESC
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
        const result = await pool.query('SELECT LopMH_ID AS lopmh_id, KDT_ID AS kdt_id, MH_MA AS mh_ma FROM LopMonHoc WHERE LopMH_ID = $1', [id]);
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
            'INSERT INTO LopMonHoc (KDT_ID, MH_MA) VALUES ($1, $2) RETURNING LopMH_ID AS lopmh_id, KDT_ID AS kdt_id, MH_MA AS mh_ma',
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
            'UPDATE LopMonHoc SET KDT_ID = $1, MH_MA = $2 WHERE LopMH_ID = $3 RETURNING LopMH_ID AS lopmh_id, KDT_ID AS kdt_id, MH_MA AS mh_ma',
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
        const result = await pool.query('DELETE FROM LopMonHoc WHERE LopMH_ID = $1 RETURNING LopMH_ID AS lopmh_id', [id]);
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
