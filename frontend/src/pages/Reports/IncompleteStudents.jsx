import { useState, useEffect } from 'react';
import axios from 'axios';
import { handleError } from '../../utils/errorHandler';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function IncompleteStudents() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/reports/incomplete-students`);
            setData(res.data);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { label: 'Học viên', field: 'hoten' },
        { label: 'Môn học', field: 'tenmh' },
        { label: 'Lần thi', field: 'lanthi', render: (row) => row.lanthi ?? 'Chưa thi' },
        { label: 'Điểm', field: 'diem', render: (row) => row.diem ?? 'Chưa thi' },
        { label: 'Ngày thi', field: 'ngaythi', render: (row) => row.ngaythi ? new Date(row.ngaythi).toLocaleDateString('vi-VN') : 'Chưa thi' }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Học viên chưa hoàn thành</h1>

            <div className="bg-white p-6 rounded-lg shadow">
                {data.length > 0 ? (
                    <DataTable columns={columns} data={data} />
                ) : (
                    <p className="text-gray-500 text-center py-8">Tất cả học viên đã hoàn thành các môn học!</p>
                )}
            </div>
        </div>
    );
}
