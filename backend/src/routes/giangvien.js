import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all giảng viên
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT g.user_id, u.hoten, u.ngaysinh, u.email, g.chuyenmon,
        array_agg(us.sdt) as sodienthoai
      FROM giangvien g
      JOIN "User" u ON g.user_id = u.user_id
      LEFT JOIN user_sdt us ON g.user_id = us.user_id
      GROUP BY g.user_id, u.hoten, u.ngaysinh, u.email, g.chuyenmon
      ORDER BY g.user_id DESC
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
      SELECT u.*, g.chuyenmon FROM "User" u
      JOIN giangvien g ON u.user_id = g.user_id
      WHERE u.user_id = $1
    `, [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy giảng viên' });
        }

        const sdtResult = await pool.query('SELECT sdt FROM user_sdt WHERE user_id = $1', [id]);

        res.json({
            ...userResult.rows[0],
            sodienthoai: sdtResult.rows.map(r => r.sdt)
        });
    } catch (error) {
        console.error('Lỗi GET /giangvien/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Tạo giảng viên mới (TRANSACTION: User + giangvien + user_sdt)
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { hoten, ngaysinh, email, chuyenmon, sodienthoai } = req.body;

        // 1. Insert vào bảng User
        const userResult = await client.query(
            'INSERT INTO "User" (hoten, ngaysinh, email) VALUES ($1, $2, $3) RETURNING user_id',
            [hoten, ngaysinh, email]
        );
        const user_id = userResult.rows[0].user_id;

        // 2. Insert vào bảng giangvien
        await client.query(
            'INSERT INTO giangvien (user_id, chuyenmon) VALUES ($1, $2)',
            [user_id, chuyenmon]
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
            'UPDATE "User" SET hoten = $1, ngaysinh = $2, email = $3 WHERE user_id = $4',
            [hoten, ngaysinh, email, id]
        );

        // 2. Update giangvien
        await client.query(
            'UPDATE giangvien SET chuyenmon = $1 WHERE user_id = $2',
            [chuyenmon, id]
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

        await client.query('DELETE FROM user_sdt WHERE user_id = $1', [id]);
        await client.query('DELETE FROM giangvien WHERE user_id = $1', [id]);
        const result = await client.query('DELETE FROM "User" WHERE user_id = $1 RETURNING *', [id]);

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
