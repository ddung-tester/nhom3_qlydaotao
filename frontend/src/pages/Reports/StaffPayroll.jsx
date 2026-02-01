import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function StaffPayroll() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/reports/staff-payroll`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { label: 'Nhân viên', field: 'hoten' },
        { label: 'Lương cứng', field: 'luong_cung', render: (row) => new Intl.NumberFormat('vi-VN').format(row.luong_cung || 0) + ' VNĐ' },
        { label: 'Số HV quản lý', field: 'so_hv_quan_ly' },
        { label: 'Lương QL CT', field: 'luong_ql_ct', render: (row) => new Intl.NumberFormat('vi-VN').format(row.luong_ql_ct || 0) + ' VNĐ' },
        { label: 'Số NV dưới quyền', field: 'so_nv_duoi_quyen' },
        { label: 'Phụ cấp QL NV', field: 'phu_cap_ql_nv', render: (row) => new Intl.NumberFormat('vi-VN').format(row.phu_cap_ql_nv || 0) + ' VNĐ' },
        { label: 'Tổng lương', field: 'tong_luong', render: (row) => new Intl.NumberFormat('vi-VN').format(row.tong_luong || 0) + ' VNĐ' }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Báo cáo lương nhân viên</h1>

            <div className="bg-white p-6 rounded-lg shadow">
                {data.length > 0 ? (
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
