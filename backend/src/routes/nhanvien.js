import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all nhân viên
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT n.user_id, u.hoten, u.ngaysinh, u.email, n.ngayvaolam, n.quanly_id,
        uql.hoten as ten_quanly,
        array_agg(us.sdt) as sodienthoai
      FROM nhanvien n
      JOIN "User" u ON n.user_id = u.user_id
      LEFT JOIN "User" uql ON n.quanly_id = uql.user_id
      LEFT JOIN user_sdt us ON n.user_id = us.user_id
      GROUP BY n.user_id, u.hoten, u.ngaysinh, u.email, n.ngayvaolam, n.quanly_id, uql.hoten
      ORDER BY n.user_id DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi GET /nhanvien:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET one nhân viên
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userResult = await pool.query(`
      SELECT u.*, n.ngayvaolam, n.quanly_id FROM "User" u
      JOIN nhanvien n ON u.user_id = n.user_id
      WHERE u.user_id = $1
    `, [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
        }

        const sdtResult = await pool.query('SELECT sdt FROM user_sdt WHERE user_id = $1', [id]);

        res.json({
            ...userResult.rows[0],
            sodienthoai: sdtResult.rows.map(r => r.sdt)
        });
    } catch (error) {
        console.error('Lỗi GET /nhanvien/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Tạo nhân viên mới (TRANSACTION: User + nhanvien + user_sdt)
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { hoten, ngaysinh, email, ngayvaolam, quanly_id, sodienthoai } = req.body;

        // 1. Insert vào bảng User
        const userResult = await client.query(
            'INSERT INTO "User" (hoten, ngaysinh, email) VALUES ($1, $2, $3) RETURNING user_id',
            [hoten, ngaysinh, email]
        );
        const user_id = userResult.rows[0].user_id;

        // 2. Xử lý quanly_id: nếu không có thì để NULL (đứng đầu)
        const final_quanly_id = quanly_id || null;

        if (final_quanly_id == user_id) {
            throw new Error('Nhân viên không thể tự quản lý chính mình');
        }

        // 3. Insert vào bảng nhanvien
        await client.query(
            'INSERT INTO nhanvien (user_id, ngayvaolam, quanly_id) VALUES ($1, $2, $3)',
            [user_id, ngayvaolam, final_quanly_id]
        );

        // 4. Insert số điện thoại
        if (sodienthoai && sodienthoai.length > 0) {
            for (const sdt of sodienthoai) {
                await client.query(
                    'INSERT INTO user_sdt (user_id, sdt) VALUES ($1, $2)',
                    [user_id, sdt]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ user_id, hoten, ngaysinh, email, ngayvaolam, quanly_id: final_quanly_id, sodienthoai });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Lỗi POST /nhanvien:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// PUT - Cập nhật nhân viên
router.put('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const { hoten, ngaysinh, email, ngayvaolam, quanly_id, sodienthoai } = req.body;

        const final_quanly_id = quanly_id || null;
        if (final_quanly_id == id) {
            throw new Error('Nhân viên không thể tự quản lý chính mình');
        }

        // 1. Update User
        await client.query(
            'UPDATE "User" SET hoten = $1, ngaysinh = $2, email = $3 WHERE user_id = $4',
            [hoten, ngaysinh, email, id]
        );

        // 2. Update nhanvien
        await client.query(
            'UPDATE nhanvien SET ngayvaolam = $1, quanly_id = $2 WHERE user_id = $3',
            [ngayvaolam, quanly_id, id]
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
        res.json({ user_id: id, hoten, ngaysinh, email, ngayvaolam, quanly_id, sodienthoai });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Lỗi PUT /nhanvien/:id:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// DELETE - Xóa nhân viên
router.delete('/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;

        await client.query('DELETE FROM user_sdt WHERE user_id = $1', [id]);
        await client.query('DELETE FROM nhanvien WHERE user_id = $1', [id]);
        const result = await client.query('DELETE FROM "User" WHERE user_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
        }

        await client.query('COMMIT');
        res.json({ message: 'Xóa thành công', data: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Lỗi DELETE /nhanvien/:id:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

export default router;
