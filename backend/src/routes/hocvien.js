import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all học viên
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT h.user_id, u.hoten, u.ngaysinh, u.email, h.diachi,
        array_agg(us.sdt) as sodienthoai
      FROM hocvien h
      JOIN "User" u ON h.user_id = u.user_id
      LEFT JOIN user_sdt us ON h.user_id = us.user_id
      GROUP BY h.user_id, u.hoten, u.ngaysinh, u.email, h.diachi
      ORDER BY h.user_id DESC
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
      SELECT u.*, h.diachi FROM "User" u
      JOIN hocvien h ON u.user_id = h.user_id
      WHERE u.user_id = $1
    `, [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy học viên' });
        }

        const sdtResult = await pool.query('SELECT sdt FROM user_sdt WHERE user_id = $1', [id]);

        res.json({
            ...userResult.rows[0],
            sodienthoai: sdtResult.rows.map(r => r.sdt)
        });
    } catch (error) {
        console.error('Lỗi GET /hocvien/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Tạo học viên mới (TRANSACTION: User + hocvien + user_sdt)
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { hoten, ngaysinh, email, diachi, sodienthoai } = req.body;

        // 1. Insert vào bảng User
        const userResult = await client.query(
            'INSERT INTO "User" (hoten, ngaysinh, email) VALUES ($1, $2, $3) RETURNING user_id',
            [hoten, ngaysinh, email]
        );
        const user_id = userResult.rows[0].user_id;

        // 2. Insert vào bảng hocvien
        await client.query(
            'INSERT INTO hocvien (user_id, diachi) VALUES ($1, $2)',
            [user_id, diachi]
        );

        // 3. Insert số điện thoại
        if (sodienthoai && sodienthoai.length > 0) {
            for (const sdt of sodienthoai) {
                await client.query(
                    'INSERT INTO user_sdt (user_id, sdt) VALUES ($1, $2)',
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
            'UPDATE "User" SET hoten = $1, ngaysinh = $2, email = $3 WHERE user_id = $4',
            [hoten, ngaysinh, email, id]
        );

        // 2. Update hocvien
        await client.query(
            'UPDATE hocvien SET diachi = $1 WHERE user_id = $2',
            [diachi, id]
        );

        // 3. Xóa và thêm lại số điện thoại
        await client.query('DELETE FROM user_sdt WHERE user_id = $1', [id]);
        if (sodienthoai && sodienthoai.length > 0) {
            for (const sdt of sodienthoai) {
                await client.query(
                    'INSERT INTO user_sdt (user_id, sdt) VALUES ($1, $2)',
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

        // Xóa user_sdt, hocvien, sau đó User
        await client.query('DELETE FROM user_sdt WHERE user_id = $1', [id]);
        await client.query('DELETE FROM hocvien WHERE user_id = $1', [id]);
        const result = await client.query('DELETE FROM "User" WHERE user_id = $1 RETURNING *', [id]);

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
