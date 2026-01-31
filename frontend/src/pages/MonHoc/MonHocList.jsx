import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function MonHocList() {
    const [data, setData] = useState([]);
    const [chuongtrinhList, setChuongtrinhList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ mh_ma: '', ct_id: '', tenmh: '', sogio: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
        fetchChuongTrinh();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/monhoc`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChuongTrinh = async () => {
        try {
            const res = await axios.get(`${API_URL}/chuongtrinh`);
            setChuongtrinhList(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/monhoc/${editingId}`, formData);
            } else {
                await axios.post(`${API_URL}/monhoc`, formData);
            }
            fetchData();
            resetForm();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (row) => {
        setFormData({ mh_ma: row.mh_ma, ct_id: row.ct_id, tenmh: row.tenmh, sogio: row.sogio });
        setEditingId(row.mh_ma);
        setShowForm(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Xác nhận xóa môn ${row.tenmh}?`)) {
            try {
                await axios.delete(`${API_URL}/monhoc/${row.mh_ma}`);
                fetchData();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({ mh_ma: '', ct_id: '', tenmh: '', sogio: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const columns = [
        { label: 'Mã MH', field: 'mh_ma' },
        { label: 'Tên môn học', field: 'tenmh' },
        { label: 'Số giờ', field: 'sogio' },
        { label: 'Chương trình', field: 'tenct' }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Môn học</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {showForm ? 'Hủy' : '+ Thêm môn học'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">{editingId ? 'Sửa môn học' : 'Thêm mới'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã môn học *</label>
                                <input type="text" required disabled={!!editingId} value={formData.mh_ma}
                                    onChange={(e) => setFormData({ ...formData, mh_ma: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Chương trình *</label>
                                <select required value={formData.ct_id}
                                    onChange={(e) => setFormData({ ...formData, ct_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn --</option>
                                    {chuongtrinhList.map((ct) => (
                                        <option key={ct.ct_id} value={ct.ct_id}>{ct.tenct}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên môn học *</label>
                                <input type="text" required value={formData.tenmh}
                                    onChange={(e) => setFormData({ ...formData, tenmh: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số giờ *</label>
                                <input type="number" required value={formData.sogio}
                                    onChange={(e) => setFormData({ ...formData, sogio: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Hủy</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingId ? 'Cập nhật' : 'Thêm'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <DataTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
}
