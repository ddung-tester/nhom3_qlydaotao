import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function TeacherPayroll() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/reports/teacher-payroll`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Báo cáo lương giảng viên</h1>

            <div className="bg-white p-6 rounded-lg shadow">
                {data.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Giảng viên</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Chuyên môn</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Vai trò</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Tổng giờ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Lương dự tính</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Tổng lương</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm text-gray-900">{row.ten_gv}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{row.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{row.chuyenmon}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{row.vaitro}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{row.tong_gio}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{new Intl.NumberFormat('vi-VN').format(row.luong)} VNĐ</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-bold text-blue-600">{new Intl.NumberFormat('vi-VN').format(row.tong_luong_gv)} VNĐ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-right">
                            <p className="text-lg font-bold text-blue-600">
                                Tổng chi dự kiến: {new Intl.NumberFormat('vi-VN').format(
                                    data.reduce((sum, row) => sum + parseFloat(row.luong || 0), 0)
                                )} VNĐ
                            </p>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-center py-8">Chưa có dữ liệu giảng dạy để tính lương</p>
                )}
            </div>
        </div>
    );
}
