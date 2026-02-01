import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function StudentResults() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/reports/student-results`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { label: 'Học viên', field: 'hoten' },
        { label: 'Chương trình', field: 'tenct' },
        { label: 'Khóa đào tạo', field: 'tenkhoa' },
        { label: 'Học kỳ', field: 'hocky' },
        { label: 'Năm', field: 'nam' },
        { label: 'Mã MH', field: 'mh_ma' },
        { label: 'Tên môn học', field: 'tenmh' },
        { label: 'Điểm cao nhất', field: 'diem_cao_nhat' },
        { label: 'Điểm TB khóa', field: 'diem_tb_khoa' }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Kết quả học tập của học viên đã hoàn thành</h1>

            <div className="bg-white p-6 rounded-lg shadow">
                {data.length > 0 ? (
                    <DataTable columns={columns} data={data} />
                ) : (
                    <p className="text-gray-500 text-center py-8">Chưa có dữ liệu kết quả học tập</p>
                )}
            </div>
        </div>
    );
}
