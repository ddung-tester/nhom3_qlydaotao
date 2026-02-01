import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all học viên
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT h.USER_ID AS user_id, u.HoTen AS hoten, u.NgaySinh AS ngaysinh, u.Email AS email, h.DiaChi AS diachi,
        array_agg(us.SDT) as sodienthoai
      FROM HocVien h
      JOIN "User" u ON h.USER_ID = u.USER_ID
      LEFT JOIN User_SDT us ON h.USER_ID = us.USER_ID
      GROUP BY h.USER_ID, u.HoTen, u.NgaySinh, u.Email, h.DiaChi
      ORDER BY h.USER_ID DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi GET /hocvien:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET one học viên
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userResult = await pool.query(`
      SELECT u.USER_ID AS user_id, u.HoTen AS hoten, u.NgaySinh AS ngaysinh, u.Email AS email, h.DiaChi AS diachi 
      FROM "User" u
      JOIN HocVien h ON u.USER_ID = h.USER_ID
      WHERE u.USER_ID = $1
    `, [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy học viên' });
        }

        const sdtResult = await pool.query('SELECT SDT AS sdt FROM User_SDT WHERE USER_ID = $1', [id]);

        res.json({
            ...userResult.rows[0],
            sodienthoai: sdtResult.rows.map(r => r.sdt)
        });
    } catch (error) {
        console.error('Lỗi GET /hocvien/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Tạo học viên mới (TRANSACTION: User + HocVien + User_SDT)
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { hoten, ngaysinh, email, diachi, sodienthoai } = req.body;

        // 1. Insert vào bảng User
        const userResult = await client.query(
            'INSERT INTO "User" (HoTen, NgaySinh, Email) VALUES ($1, $2, $3) RETURNING USER_ID AS user_id',
            [hoten, ngaysinh, email]
        );
        const user_id = userResult.rows[0].user_id;

        // 2. Insert vào bảng HocVien
        await client.query(
            'INSERT INTO HocVien (USER_ID, DiaChi) VALUES ($1, $2)',
            [user_id, diachi]
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
        res.status(201).json({ user_id, hoten, ngaysinh, email, diachi, sodienthoai });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Lỗi POST /hocvien:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// PUT - Cập nhật học viên
router.put('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const { hoten, ngaysinh, email, diachi, sodienthoai } = req.body;

        // 1. Update User
        await client.query(
            'UPDATE "User" SET HoTen = $1, NgaySinh = $2, Email = $3 WHERE USER_ID = $4',
            [hoten, ngaysinh, email, id]
        );

        // 2. Update HocVien
        await client.query(
            'UPDATE HocVien SET DiaChi = $1 WHERE USER_ID = $2',
            [diachi, id]
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
        res.json({ user_id: id, hoten, ngaysinh, email, diachi, sodienthoai });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Lỗi PUT /hocvien/:id:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// DELETE - Xóa học viên
router.delete('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;

        // Xóa User_SDT, HocVien, sau đó User (Hoặc để ON DELETE CASCADE xử lý)
        // Trong schema mới có ON DELETE CASCADE cho User_SDT và HocVien, nên chỉ cần xóa User
        const result = await client.query('DELETE FROM "User" WHERE USER_ID = $1 RETURNING USER_ID AS user_id', [id]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Không tìm thấy học viên' });
        }

        await client.query('COMMIT');
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Lỗi DELETE /hocvien/:id:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

export default router;
