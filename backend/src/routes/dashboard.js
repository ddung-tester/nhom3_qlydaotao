import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
        const studentCount = await pool.query('SELECT COUNT(*) FROM HOCVIEN');
        const teacherCount = await pool.query('SELECT COUNT(*) FROM GIANGVIEN');
        const courseCount = await pool.query('SELECT COUNT(*) FROM KHOADAOTAO');
        const classCount = await pool.query('SELECT COUNT(*) FROM LOPMONHOC');

        res.json({
            students: parseInt(studentCount.rows[0].count),
            teachers: parseInt(teacherCount.rows[0].count),
            courses: parseInt(courseCount.rows[0].count),
            classes: parseInt(classCount.rows[0].count)
        });
    } catch (error) {
        console.error('Lỗi khi lấy thống kê dashboard:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy thống kê dashboard' });
    }
});

export default router;
