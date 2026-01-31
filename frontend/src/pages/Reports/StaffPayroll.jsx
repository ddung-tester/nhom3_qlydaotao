import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function StaffPayroll() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [params, setParams] = useState({
        base_salary: 5000000,
        rate_per_student: 500000
    });

    useEffect(() => {
        fetchData();
    }, [params]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/reports/staff-payroll`, { params });
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { label: 'Nhân viên', field: 'hoten' },
        { label: 'Email', field: 'email' },
        { label: 'Lương cứng', field: 'luong_cung', render: (row) => new Intl.NumberFormat('vi-VN').format(row.luong_cung || 0) + ' VNĐ' },
        { label: 'Số HV Quản lý', field: 'so_hv_ql' },
        { label: 'Lương QL CT', field: 'luong_ql_chuongtrinh', render: (row) => new Intl.NumberFormat('vi-VN').format(row.luong_ql_chuongtrinh || 0) + ' VNĐ' },
        { label: 'Số NV dưới quyền', field: 'so_nv_ql' },
        { label: 'Phụ cấp QL (5% x NV)', field: 'phucap_ql_nhanvien', render: (row) => new Intl.NumberFormat('vi-VN').format(row.phucap_ql_nhanvien || 0) + ' VNĐ' },
        { label: 'Tổng lương', field: 'tong_luong', render: (row) => new Intl.NumberFormat('vi-VN').format(row.tong_luong || 0) + ' VNĐ' }
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Báo cáo lương nhân viên</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mức lương cứng (VNĐ)</label>
                        <input
                            type="number"
                            value={params.base_salary}
                            onChange={(e) => setParams({ ...params, base_salary: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thưởng mỗi HV (VNĐ)</label>
                        <input
                            type="number"
                            value={params.rate_per_student}
                            onChange={(e) => setParams({ ...params, rate_per_student: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                {loading ? (
                    <div className="text-center py-8">Đang tính toán...</div>
                ) : data.length > 0 ? (
                    <>
                        <DataTable columns={columns} data={data} />
                        <div className="mt-4 text-right">
                            <p className="text-lg font-bold text-blue-600">
                                Tổng ngân sách lương: {new Intl.NumberFormat('vi-VN').format(
                                    data.reduce((sum, row) => sum + parseFloat(row.tong_luong || 0), 0)
                                )} VNĐ
                            </p>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-center py-8">Chưa có dữ liệu nhân viên</p>
                )}
            </div>
        </div>
    );
}
