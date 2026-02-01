import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET - Lấy danh sách buổi học
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                bh.BuoiHoc_ID AS buoihoc_id,
                bh.NgayHoc AS ngayhoc,
                bh.GioBD AS giobd,
                bh.GioKt AS giokt,
                mh.TenMH AS tenmh,
                mh.MH_MA AS mh_ma,
                STRING_AGG(DISTINCT u.HoTen || ' (' || pc.VaiTro || ')', ', ' ORDER BY u.HoTen || ' (' || pc.VaiTro || ')') AS giangvien
            FROM BuoiHoc bh
            LEFT JOIN XepLich xl ON xl.BuoiHoc_ID = bh.BuoiHoc_ID
            LEFT JOIN LopMonHoc lm ON lm.LopMH_ID = xl.LopMH_ID
            LEFT JOIN MonHoc mh ON mh.MH_MA = lm.MH_MA
            LEFT JOIN PhanCong pc ON pc.LopMH_ID = lm.LopMH_ID
            LEFT JOIN "User" u ON u.USER_ID = pc.GV_ID
            GROUP BY bh.BuoiHoc_ID, bh.NgayHoc, bh.GioBD, bh.GioKt, mh.TenMH, mh.MH_MA
            ORDER BY bh.NgayHoc DESC, bh.GioBD
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Lấy chi tiết buổi học
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT bh.BuoiHoc_ID AS buoihoc_id, bh.NgayHoc AS ngayhoc, bh.GioBD AS giobd, bh.GioKt AS giokt,
                   xl.LopMH_ID AS lopmh_id, xl.PH_ID AS ph_id
            FROM BuoiHoc bh
            LEFT JOIN XepLich xl ON xl.BuoiHoc_ID = bh.BuoiHoc_ID
            WHERE bh.BuoiHoc_ID = $1
        `, [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Thêm buổi học mới (bao gồm xếp lịch)
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { ngayhoc, giobd, giokt, lopmh_id, ph_id } = req.body;

        // Insert BuoiHoc
        const bhResult = await client.query(
            'INSERT INTO BuoiHoc (NgayHoc, GioBD, GioKt) VALUES ($1, $2, $3) RETURNING BuoiHoc_ID AS buoihoc_id',
            [ngayhoc, giobd, giokt]
        );
        const buoihoc_id = bhResult.rows[0].buoihoc_id;

        // Insert XepLich if lopmh_id and ph_id provided
        if (lopmh_id && ph_id) {
            await client.query(
                'INSERT INTO XepLich (BuoiHoc_ID, LopMH_ID, PH_ID) VALUES ($1, $2, $3)',
                [buoihoc_id, lopmh_id, ph_id]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ buoihoc_id, ngayhoc, giobd, giokt, lopmh_id, ph_id });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// PUT - Cập nhật buổi học
router.put('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { ngayhoc, giobd, giokt, lopmh_id, ph_id } = req.body;

        // Update BuoiHoc
        await client.query(
            'UPDATE BuoiHoc SET NgayHoc = $1, GioBD = $2, GioKt = $3 WHERE BuoiHoc_ID = $4',
            [ngayhoc, giobd, giokt, id]
        );

        // Delete existing XepLich
        await client.query('DELETE FROM XepLich WHERE BuoiHoc_ID = $1', [id]);

        // Insert new XepLich if provided
        if (lopmh_id && ph_id) {
            await client.query(
                'INSERT INTO XepLich (BuoiHoc_ID, LopMH_ID, PH_ID) VALUES ($1, $2, $3)',
                [id, lopmh_id, ph_id]
            );
        }

        await client.query('COMMIT');
        res.json({ buoihoc_id: id, ngayhoc, giobd, giokt, lopmh_id, ph_id });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// DELETE - Xóa buổi học
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM BuoiHoc WHERE BuoiHoc_ID = $1 RETURNING BuoiHoc_ID AS buoihoc_id', [id]);
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
