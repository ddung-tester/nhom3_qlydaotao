import express from 'express';
import pool from '../db.js';

const router = express.Router();

// ============================================================================
// 5.2.1. Các thao tác CRUD cho MonHoc
// ============================================================================

// 1. Thêm (Insert)
router.post('/', async (req, res) => {
    try {
        const { mh_ma, ct_id, tenmh, sogio } = req.body;
        const query = `
            INSERT INTO MonHoc (MH_MA, CT_ID, TenMH, SoGio)
            VALUES ($1, $2, $3, $4)
            RETURNING MH_MA AS mh_ma, CT_ID AS ct_id, TenMH AS tenmh, SoGio AS sogio
        `;
        const result = await pool.query(query, [mh_ma, ct_id, tenmh, sogio]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi POST /monhoc:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Tìm kiếm (Search/Select)
router.get('/', async (req, res) => {
    try {
        const { ct_id, tenmh } = req.query;
        let query = `
            SELECT m.MH_MA AS mh_ma, m.CT_ID AS ct_id, m.TenMH AS tenmh, m.SoGio AS sogio,
                   c.TenCT AS tenct
            FROM MonHoc m
            LEFT JOIN ChuongTrinh c ON m.CT_ID = c.CT_ID
            WHERE 1=1
        `;
        const params = [];

        if (ct_id) {
            params.push(ct_id);
            query += ` AND m.CT_ID = $${params.length}`;
        }

        if (tenmh) {
            params.push(`%${tenmh}%`);
            query += ` AND m.TenMH ILIKE $${params.length}`;
        }

        query += ' ORDER BY m.TenMH';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Lỗi GET /monhoc:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Sửa (Update)
router.put('/:ma', async (req, res) => {
    try {
        const { ma } = req.params;
        const { sogio, tenmh, ct_id } = req.body;

        // Có thể cập nhật nhiều trường, nhưng phần 5.2.1-3 tập trung vào SoGio
        const query = `
            UPDATE MonHoc
            SET SoGio = COALESCE($1, SoGio),
                TenMH = COALESCE($2, TenMH),
                CT_ID = COALESCE($3, CT_ID)
            WHERE MH_MA = $4
            RETURNING MH_MA AS mh_ma, CT_ID AS ct_id, TenMH AS tenmh, SoGio AS sogio
        `;
        const result = await pool.query(query, [sogio, tenmh, ct_id, ma]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy môn học' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi PUT /monhoc/:ma:', error);
        res.status(500).json({ error: error.message });
    }
});

// 4. Xóa (Delete)
router.delete('/:ma', async (req, res) => {
    try {
        const { ma } = req.params;
        const query = 'DELETE FROM MonHoc WHERE MH_MA = $1 RETURNING MH_MA AS mh_ma';
        const result = await pool.query(query, [ma]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy môn học' });
        }
        res.json({ message: 'Xóa thành công', mh_ma: result.rows[0].mh_ma });
    } catch (error) {
        console.error('Lỗi DELETE /monhoc/:ma:', error);
        res.status(500).json({ error: error.message });
    }
});

// Lấy thông tin chi tiết môn học
router.get('/:ma', async (req, res) => {
    try {
        const { ma } = req.params;
        const result = await pool.query('SELECT MH_MA AS mh_ma, CT_ID AS ct_id, TenMH AS tenmh, SoGio AS sogio FROM MonHoc WHERE MH_MA = $1', [ma]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy môn học' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Lỗi GET /monhoc/:ma:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
