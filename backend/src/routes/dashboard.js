import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET - Lấy thông tin thống kê dashboard
router.get('/stats', async (req, res) => {
    try {
        const studentCount = await pool.query('SELECT COUNT(*) FROM HocVien');
        const teacherCount = await pool.query('SELECT COUNT(*) FROM GiangVien');
        const courseCount = await pool.query('SELECT COUNT(*) FROM KhoaDaoTao');
        const classCount = await pool.query('SELECT COUNT(*) FROM LopMonHoc');

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
