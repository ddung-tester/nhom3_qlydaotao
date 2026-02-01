import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT dt.HV_ID AS hv_id, dt.LopMH_ID AS lopmh_id, dt.LanThi AS lanthi, dt.Diem AS diem, dt.NgayThi AS ngaythi,
             u.HoTen AS hoten, u.Email AS email, m.TenMH AS tenmh, k.TenKhoa AS tenkhoa
      FROM DiemThi dt
      JOIN HocVien h ON dt.HV_ID = h.USER_ID
      JOIN "User" u ON h.USER_ID = u.USER_ID
      JOIN LopMonHoc l ON dt.LopMH_ID = l.LopMH_ID
      LEFT JOIN MonHoc m ON l.MH_MA = m.MH_MA
      LEFT JOIN KhoaDaoTao k ON l.KDT_ID = k.KDT_ID
      ORDER BY dt.NgayThi DESC
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
            'INSERT INTO DiemThi (HV_ID, LopMH_ID, LanThi, Diem, NgayThi) VALUES ($1, $2, $3, $4, $5) RETURNING HV_ID AS hv_id, LopMH_ID AS lopmh_id, LanThi AS lanthi, Diem AS diem, NgayThi AS ngaythi',
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
            'UPDATE DiemThi SET Diem = $1, NgayThi = $2 WHERE HV_ID = $3 AND LopMH_ID = $4 AND LanThi = $5 RETURNING HV_ID AS hv_id, LopMH_ID AS lopmh_id, LanThi AS lanthi, Diem AS diem, NgayThi AS ngaythi',
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
        const result = await pool.query('DELETE FROM DiemThi WHERE HV_ID = $1 AND LopMH_ID = $2 AND LanThi = $3 RETURNING HV_ID AS hv_id, LopMH_ID AS lopmh_id, LanThi AS lanthi', [hv_id, lopmh_id, lanthi]);
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
