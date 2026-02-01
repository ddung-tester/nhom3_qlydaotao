import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT pc.PC_ID AS pc_id, pc.GV_ID AS gv_id, pc.LopMH_ID AS lopmh_id, pc.VaiTro AS vaitro,
             u.HoTen as ten_gv, u.Email as email_gv, g.ChuyenMon AS chuyenmon, 
             m.TenMH AS tenmh, k.TenKhoa AS tenkhoa
      FROM PhanCong pc
      JOIN GiangVien g ON pc.GV_ID = g.USER_ID
      JOIN "User" u ON g.USER_ID = u.USER_ID
      JOIN LopMonHoc l ON pc.LopMH_ID = l.LopMH_ID
      LEFT JOIN MonHoc m ON l.MH_MA = m.MH_MA
      LEFT JOIN KhoaDaoTao k ON l.KDT_ID = k.KDT_ID
      ORDER BY pc.PC_ID DESC
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
            'INSERT INTO PhanCong (GV_ID, LopMH_ID, VaiTro) VALUES ($1, $2, $3) RETURNING PC_ID AS pc_id, GV_ID AS gv_id, LopMH_ID AS lopmh_id, VaiTro AS vaitro',
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
            'UPDATE PhanCong SET GV_ID = $1, LopMH_ID = $2, VaiTro = $3 WHERE PC_ID = $4 RETURNING PC_ID AS pc_id, GV_ID AS gv_id, LopMH_ID AS lopmh_id, VaiTro AS vaitro',
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
        const result = await pool.query('DELETE FROM PhanCong WHERE PC_ID = $1 RETURNING PC_ID AS pc_id', [id]);
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
