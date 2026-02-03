import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function TeacherPayroll() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [hourlyRate, setHourlyRate] = useState(100000);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/reports/teacher-payroll`, {
                params: { month, year, hourlyRate }
            });
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Báo cáo lương giảng viên</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tháng</label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>Tháng {m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Năm</label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Thù lao trợ giảng / giờ</label>
                        <input
                            type="number"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                            className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                        <p className="absolute left-0 -bottom-5 text-xs text-gray-500 whitespace-nowrap">
                            Lương Giảng viên = 2x ({new Intl.NumberFormat('vi-VN').format(hourlyRate * 2)})
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Xem báo cáo
                    </button>
                </form>
                <div className="mt-4 p-3 bg-blue-50 text-sm text-blue-800 rounded border border-blue-100">
                    <strong>Công thức tính lương :</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Lương Giảng viên = Số giờ dạy * (Đơn giá x 2)</li>
                        <li>Lương Trợ giảng = Số giờ dạy * Đơn giá</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                {loading ? <div className="text-center py-8">Đang tải...</div> : (
                    data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Giảng viên</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Giờ giảng viên</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Giờ trợ giảng</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Tổng lương</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {data.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm text-gray-900">{row.hoten}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{row.gio_giang_vien} giờ</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{row.gio_tro_giang} giờ</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-bold text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN').format(row.tong_luong)} VNĐ
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 text-right">
                                <p className="text-lg font-bold text-blue-600">
                                    Tổng chi lương: {new Intl.NumberFormat('vi-VN').format(
                                        data.reduce((sum, row) => sum + parseFloat(row.tong_luong || 0), 0)
                                    )} VNĐ
                                </p>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 text-center py-8">Chưa có dữ liệu giảng dạy cho tháng {month}/{year}</p>
                    )
                )}
            </div>
        </div>
    );
}
