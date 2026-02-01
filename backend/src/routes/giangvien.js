import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all giảng viên
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT g.USER_ID AS user_id, u.HoTen AS hoten, u.NgaySinh AS ngaysinh, u.Email AS email, g.ChuyenMon AS chuyenmon,
        array_agg(us.SDT) as sodienthoai
      FROM GiangVien g
      JOIN "User" u ON g.USER_ID = u.USER_ID
      LEFT JOIN User_SDT us ON g.USER_ID = us.USER_ID
      GROUP BY g.USER_ID, u.HoTen, u.NgaySinh, u.Email, g.ChuyenMon
      ORDER BY g.USER_ID DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi GET /giangvien:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET one giảng viên
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userResult = await pool.query(`
      SELECT u.USER_ID AS user_id, u.HoTen AS hoten, u.NgaySinh AS ngaysinh, u.Email AS email, g.ChuyenMon AS chuyenmon 
      FROM "User" u
      JOIN GiangVien g ON u.USER_ID = g.USER_ID
      WHERE u.USER_ID = $1
    `, [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy giảng viên' });
        }

        const sdtResult = await pool.query('SELECT SDT AS sdt FROM User_SDT WHERE USER_ID = $1', [id]);

        res.json({
            ...userResult.rows[0],
            sodienthoai: sdtResult.rows.map(r => r.sdt)
        });
    } catch (error) {
        console.error('Lỗi GET /giangvien/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Tạo giảng viên mới (TRANSACTION: User + GiangVien + User_SDT)
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { hoten, ngaysinh, email, chuyenmon, sodienthoai } = req.body;

        // 1. Insert vào bảng User
        const userResult = await client.query(
            'INSERT INTO "User" (HoTen, NgaySinh, Email) VALUES ($1, $2, $3) RETURNING USER_ID AS user_id',
            [hoten, ngaysinh, email]
        );
        const user_id = userResult.rows[0].user_id;

        // 2. Insert vào bảng GiangVien
        await client.query(
            'INSERT INTO GiangVien (USER_ID, ChuyenMon) VALUES ($1, $2)',
            [user_id, chuyenmon]
        );

        // 3. Insert số điện thoại
        if (sodienthoai && sodienthoai.length > 0) {
            for (const sdt of sodienthoai) {
                await client.query(
                    'INSERT INTO User_SDT (USER_ID, SDT) VALUES ($1, $2)',
                    [user_id, sdt]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ user_id, hoten, ngaysinh, email, chuyenmon, sodienthoai });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Lỗi POST /giangvien:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// PUT - Cập nhật giảng viên
router.put('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const { hoten, ngaysinh, email, chuyenmon, sodienthoai } = req.body;

        // 1. Update User
        await client.query(
            'UPDATE "User" SET HoTen = $1, NgaySinh = $2, Email = $3 WHERE USER_ID = $4',
            [hoten, ngaysinh, email, id]
        );

        // 2. Update GiangVien
        await client.query(
            'UPDATE GiangVien SET ChuyenMon = $1 WHERE USER_ID = $2',
            [chuyenmon, id]
        );

        // 3. Xóa và thêm lại số điện thoại
        await client.query('DELETE FROM User_SDT WHERE USER_ID = $1', [id]);
        if (sodienthoai && sodienthoai.length > 0) {
            for (const sdt of sodienthoai) {
                await client.query(
                    'INSERT INTO User_SDT (USER_ID, SDT) VALUES ($1, $2)',
                    [id, sdt]
                );
            }
        }

        await client.query('COMMIT');
        res.json({ user_id: id, hoten, ngaysinh, email, chuyenmon, sodienthoai });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Lỗi PUT /giangvien/:id:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// DELETE - Xóa giảng viên
router.delete('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;

        // Xóa User liên đới (Cascade trong schema sẽ xử lý GiangVien và User_SDT)
        const result = await client.query('DELETE FROM "User" WHERE USER_ID = $1 RETURNING USER_ID AS user_id', [id]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Không tìm thấy giảng viên' });
        }

        await client.query('COMMIT');
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Lỗi DELETE /giangvien/:id:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

export default router;
