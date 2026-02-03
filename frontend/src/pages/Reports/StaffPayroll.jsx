import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function StaffPayroll() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mặc định là tháng hiện tại (YYYY-MM)
    const [month, setMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    });
    const [studentRate, setStudentRate] = useState(100000);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // API trả về: { month, config, data: [...] }
            const res = await axios.get(`${API_URL}/payroll`, {
                params: { month, studentRate }
            });
            setData(res.data.data || []);
        } catch (error) {
            console.error('Lỗi API Payroll:', error);
            setError(error.response?.data?.details || error.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    const columns = [
        { label: 'Nhân viên', field: 'hoten' },
        {
            label: 'Lương cứng',
            field: 'base_salary',
            render: (row) => new Intl.NumberFormat('vi-VN').format(row.base_salary) + ' đ'
        },
        {
            label: 'Lương QL CT',
            field: 'mgmt_program_salary',
            render: (row) => (
                <div title={`${row.student_count} học viên`}>
                    {new Intl.NumberFormat('vi-VN').format(row.mgmt_program_salary)} đ
                    <div className="text-xs text-gray-400">({row.student_count} HV)</div>
                </div>
            )
        },
        {
            label: 'Thưởng QL NV',
            field: 'subordinate_bonus',
            render: (row) => (
                <div title={`${row.subordinate_count} nhân viên dưới quyền`}>
                    {new Intl.NumberFormat('vi-VN').format(row.subordinate_bonus)} đ
                    <div className="text-xs text-gray-400">({row.subordinate_count} NV)</div>
                </div>
            )
        },
        {
            label: 'Tổng thực nhận',
            field: 'total_salary',
            render: (row) => <strong className="text-blue-600">{new Intl.NumberFormat('vi-VN').format(row.total_salary)} đ</strong>
        }
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng tính lương nhân viên</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tháng tính lương</label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Định mức QL học viên (VND/HV)
                        </label>
                        <input
                            type="number"
                            value={studentRate}
                            onChange={(e) => setStudentRate(e.target.value)}
                            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder="Mặc định: 100000"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium"
                    >
                        Tính lương
                    </button>
                </form>
                <div className="mt-4 p-3 bg-blue-50 text-sm text-blue-800 rounded border border-blue-100">
                    <strong>Công thức tính lương:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li><strong>Lương cứng:</strong> 5,000,000 đ (Cố định).</li>
                        <li><strong>Lương QL Chương trình:</strong> Số học viên quản lý * Định mức (nhập ở trên).</li>
                        <li><strong>Thưởng QL Nhân viên:</strong> 5% Lương cứng * Số nhân viên dưới quyền.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded mb-4 border border-red-200">
                        <strong>Lỗi:</strong> {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Đang tính toán số liệu...</div>
                ) : (
                    data.length > 0 ? (
                        <>
                            <DataTable columns={columns} data={data} />
                            <div className="mt-6 flex justify-end">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-right">
                                    <span className="text-gray-600 block text-sm">Tổng quỹ lương tháng này</span>
                                    <span className="text-2xl font-bold text-blue-700">
                                        {new Intl.NumberFormat('vi-VN').format(
                                            data.reduce((sum, row) => sum + parseFloat(row.total_salary || 0), 0)
                                        )} đ
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg text-gray-500">
                            Không có dữ liệu nhân viên nào cho tháng {month}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
