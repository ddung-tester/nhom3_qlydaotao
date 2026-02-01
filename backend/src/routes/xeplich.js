import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT x.BuoiHoc_ID AS buoihoc_id, x.LopMH_ID AS lopmh_id, x.PH_ID AS ph_id,
             b.NgayHoc AS ngayhoc, 
             TO_CHAR(b.NgayHoc, 'Day') AS thu,
             b.GioBD AS giobd, b.GioKt AS giokt, 
             p.MaPhong AS maphong, 
             p.DiaDiem AS diadiem,
             m.TenMH AS tenmh, 
             k.TenKhoa AS tenkhoa,
             STRING_AGG(DISTINCT u.HoTen, ', ' ORDER BY u.HoTen) AS giangvien
       FROM XepLich x
       JOIN BuoiHoc b ON x.BuoiHoc_ID = b.BuoiHoc_ID
       JOIN LopMonHoc l ON x.LopMH_ID = l.LopMH_ID
       JOIN PhongHoc p ON x.PH_ID = p.PH_ID
       LEFT JOIN MonHoc m ON l.MH_MA = m.MH_MA
       LEFT JOIN KhoaDaoTao k ON l.KDT_ID = k.KDT_ID
       LEFT JOIN PhanCong pc ON pc.LopMH_ID = l.LopMH_ID
       LEFT JOIN "User" u ON u.USER_ID = pc.GV_ID
       GROUP BY x.BuoiHoc_ID, x.LopMH_ID, x.PH_ID, b.NgayHoc, b.GioBD, b.GioKt, p.MaPhong, p.DiaDiem, m.TenMH, k.TenKhoa
       ORDER BY b.NgayHoc, b.GioBD
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
            'INSERT INTO XepLich (BuoiHoc_ID, LopMH_ID, PH_ID) VALUES ($1, $2, $3) RETURNING BuoiHoc_ID AS buoihoc_id, LopMH_ID AS lopmh_id, PH_ID AS ph_id',
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
            'UPDATE XepLich SET LopMH_ID = $1, PH_ID = $2 WHERE BuoiHoc_ID = $3 RETURNING BuoiHoc_ID AS buoihoc_id, LopMH_ID AS lopmh_id, PH_ID AS ph_id',
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
        const result = await pool.query('DELETE FROM XepLich WHERE BuoiHoc_ID = $1 RETURNING BuoiHoc_ID AS buoihoc_id', [buoihoc_id]);
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
