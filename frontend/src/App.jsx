import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HocVienList from './pages/HocVien/HocVienList';
import GiangVienList from './pages/GiangVien/GiangVienList';
import NhanVienList from './pages/NhanVien/NhanVienList';
import ChuongTrinhList from './pages/ChuongTrinh/ChuongTrinhList';
import MonHocList from './pages/MonHoc/MonHocList';
import KyHocList from './pages/KyHoc/KyHocList';
import KhoaDaoTaoList from './pages/KhoaDaoTao/KhoaDaoTaoList';
import LopMonHocList from './pages/LopMonHoc/LopMonHocList';
import DangKyKhoaList from './pages/DangKyKhoa/DangKyKhoaList';
import DiemThiList from './pages/DiemThi/DiemThiList';
import PhanCongList from './pages/PhanCong/PhanCongList';
import BuoiHocList from './pages/BuoiHoc/BuoiHocList';
import PhongHocList from './pages/PhongHoc/PhongHocList';
import XepLichList from './pages/XepLich/XepLichList';
import StudentResults from './pages/Reports/StudentResults';
import IncompleteStudents from './pages/Reports/IncompleteStudents';
import TeacherPayroll from './pages/Reports/TeacherPayroll';
import StaffPayroll from './pages/Reports/StaffPayroll';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="hocvien" element={<HocVienList />} />
                        <Route path="giangvien" element={<GiangVienList />} />
                        <Route path="nhanvien" element={<NhanVienList />} />
                        <Route path="chuongtrinh" element={<ChuongTrinhList />} />
                        <Route path="monhoc" element={<MonHocList />} />
                        <Route path="kyhoc" element={<KyHocList />} />
                        <Route path="khoadaotao" element={<KhoaDaoTaoList />} />
                        <Route path="lopmonhoc" element={<LopMonHocList />} />
                        <Route path="dangkykhoa" element={<DangKyKhoaList />} />
                        <Route path="diemthi" element={<DiemThiList />} />
                        <Route path="phancong" element={<PhanCongList />} />
                        <Route path="buoihoc" element={<BuoiHocList />} />
                        <Route path="phonghoc" element={<PhongHocList />} />
                        <Route path="xeplich" element={<XepLichList />} />
                        <Route path="reports/student-results" element={<StudentResults />} />
                        <Route path="reports/incomplete-students" element={<IncompleteStudents />} />
                        <Route path="reports/teacher-payroll" element={<TeacherPayroll />} />
                        <Route path="reports/staff-payroll" element={<StaffPayroll />} />
                    </Route>
                </Routes>
            </Router>
            <ToastContainer />
        </>
    );
}

export default App;
