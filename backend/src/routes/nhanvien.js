import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all nhân viên
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT n.USER_ID AS user_id, u.HoTen AS hoten, u.NgaySinh AS ngaysinh, u.Email AS email, n.NgayVaoLam AS ngayvaolam, n.QuanLy_ID AS quanly_id,
        uql.HoTen as ten_quanly,
        array_agg(us.SDT) as sodienthoai
      FROM NhanVien n
      JOIN "User" u ON n.USER_ID = u.USER_ID
      LEFT JOIN "User" uql ON n.QuanLy_ID = uql.USER_ID
      LEFT JOIN User_SDT us ON n.USER_ID = us.USER_ID
      GROUP BY n.USER_ID, u.HoTen, u.NgaySinh, u.Email, n.NgayVaoLam, n.QuanLy_ID, uql.HoTen
      ORDER BY n.USER_ID DESC
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
      SELECT u.USER_ID AS user_id, u.HoTen AS hoten, u.NgaySinh AS ngaysinh, u.Email AS email, n.NgayVaoLam AS ngayvaolam, n.QuanLy_ID AS quanly_id 
      FROM "User" u
      JOIN NhanVien n ON u.USER_ID = n.USER_ID
      WHERE u.USER_ID = $1
    `, [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
        }

        const sdtResult = await pool.query('SELECT SDT AS sdt FROM User_SDT WHERE USER_ID = $1', [id]);

        res.json({
            ...userResult.rows[0],
            sodienthoai: sdtResult.rows.map(r => r.sdt)
        });
    } catch (error) {
        console.error('Lỗi GET /nhanvien/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Tạo nhân viên mới (TRANSACTION: User + NhanVien + User_SDT)
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { hoten, ngaysinh, email, ngayvaolam, quanly_id, sodienthoai } = req.body;

        // 1. Insert vào bảng User
        const userResult = await client.query(
            'INSERT INTO "User" (HoTen, NgaySinh, Email) VALUES ($1, $2, $3) RETURNING USER_ID AS user_id',
            [hoten, ngaysinh, email]
        );
        const user_id = userResult.rows[0].user_id;

        // 2. Xử lý QuanLy_ID: Nếu không có (đứng đầu) thì tự quản lý vì NOT NULL
        const final_quanly_id = quanly_id || user_id;

        // 3. Insert vào bảng NhanVien
        await client.query(
            'INSERT INTO NhanVien (USER_ID, NgayVaoLam, QuanLy_ID) VALUES ($1, $2, $3)',
            [user_id, ngayvaolam, final_quanly_id]
        );

        // 4. Insert số điện thoại
        if (sodienthoai && sodienthoai.length > 0) {
            for (const sdt of sodienthoai) {
                await client.query(
                    'INSERT INTO User_SDT (USER_ID, SDT) VALUES ($1, $2)',
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

        const final_quanly_id = quanly_id || id;

        // 1. Update User
        await client.query(
            'UPDATE "User" SET HoTen = $1, NgaySinh = $2, Email = $3 WHERE USER_ID = $4',
            [hoten, ngaysinh, email, id]
        );

        // 2. Update NhanVien
        await client.query(
            'UPDATE NhanVien SET NgayVaoLam = $1, QuanLy_ID = $2 WHERE USER_ID = $3',
            [ngayvaolam, final_quanly_id, id]
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
        res.json({ user_id: id, hoten, ngaysinh, email, ngayvaolam, quanly_id: final_quanly_id, sodienthoai });
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

        // Cascade xóa tự động các bảng liên quan trong schema mới
        const result = await client.query('DELETE FROM "User" WHERE USER_ID = $1 RETURNING USER_ID AS user_id', [id]);

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
