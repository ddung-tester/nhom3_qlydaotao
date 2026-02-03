import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Nạp các route
import chuongtrinhRoutes from './routes/chuongtrinh.js';
import monhocRoutes from './routes/monhoc.js';
import kyhocRoutes from './routes/kyhoc.js';
import khoadaotaoRoutes from './routes/khoadaotao.js';
import lopmonhocRoutes from './routes/lopmonhoc.js';
import hocvienRoutes from './routes/hocvien.js';
import giangvienRoutes from './routes/giangvien.js';
import nhanvienRoutes from './routes/nhanvien.js';
import dangkykhoaRoutes from './routes/dangkykhoa.js';
import diemthiRoutes from './routes/diemthi.js';
import phancongRoutes from './routes/phancong.js';
import buoihocRoutes from './routes/buoihoc.js';
import phonghocRoutes from './routes/phonghoc.js';
import xeplichRoutes from './routes/xeplich.js';
import reportRoutes from './routes/reports.js';
import payrollRoutes from './routes/payroll.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Phần mềm trung gian
app.use(cors());
app.use(express.json());

// Định tuyến API
app.use('/api/chuongtrinh', chuongtrinhRoutes);
app.use('/api/monhoc', monhocRoutes);
app.use('/api/kyhoc', kyhocRoutes);
app.use('/api/khoadaotao', khoadaotaoRoutes);
app.use('/api/lopmonhoc', lopmonhocRoutes);
app.use('/api/hocvien', hocvienRoutes);
app.use('/api/giangvien', giangvienRoutes);
app.use('/api/nhanvien', nhanvienRoutes);
app.use('/api/dangkykhoa', dangkykhoaRoutes);
app.use('/api/diemthi', diemthiRoutes);
app.use('/api/phancong', phancongRoutes);
app.use('/api/buoihoc', buoihocRoutes);
app.use('/api/phonghoc', phonghocRoutes);
app.use('/api/xeplich', xeplichRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Kiểm tra trạng thái server
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server đang chạy' });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
