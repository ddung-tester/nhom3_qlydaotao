// Simplified CRUD pages for remaining entities
// KyHocList.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import { handleError, handleSuccess } from '../../utils/errorHandler';

const API_URL = 'http://localhost:5000/api';

export default function KyHocList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ hocky: '', nam: '', ngaybatdau: '', ngayketthuc: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/kyhoc`);
            setData(res.data);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/kyhoc/${editingId}`, formData);
            } else {
                await axios.post(`${API_URL}/kyhoc`, formData);
            }
            fetchData();
            resetForm();
            handleSuccess(editingId ? 'Cập nhật kỳ học thành công!' : 'Thêm kỳ học mới thành công!');
        } catch (error) {
            handleError(error);
        }
    };

    const handleEdit = (row) => {
        setFormData({
            hocky: row.hocky,
            nam: row.nam,
            ngaybatdau: row.ngaybatdau?.split('T')[0] || '',
            ngayketthuc: row.ngayketthuc?.split('T')[0] || ''
        });
        setEditingId(row.ky_id);
        setShowForm(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm('Xác nhận xóa?')) {
            try {
                await axios.delete(`${API_URL}/kyhoc/${row.ky_id}`);
                fetchData();
                handleSuccess('Xóa kỳ học thành công!');
            } catch (error) {
                handleError(error);
            }
        }
    };

    const resetForm = () => {
        setFormData({ hocky: '', nam: '', ngaybatdau: '', ngayketthuc: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const columns = [
        { label: 'ID', field: 'ky_id' },
        { label: 'Học kỳ', field: 'hocky' },
        { label: 'Năm', field: 'nam' },
        { label: 'Ngày bắt đầu', field: 'ngaybatdau', render: (row) => row.ngaybatdau?.split('T')[0] },
        { label: 'Ngày kết thúc', field: 'ngayketthuc', render: (row) => row.ngayketthuc?.split('T')[0] }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Kỳ học</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {showForm ? 'Hủy' : '+ Thêm kỳ học'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">{editingId ? 'Sửa' : 'Thêm mới'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Học kỳ *</label>
                                <input type="text" required value={formData.hocky}
                                    onChange={(e) => setFormData({ ...formData, hocky: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="VD: HK1, HK2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Năm *</label>
                                <input type="number" required value={formData.nam}
                                    onChange={(e) => setFormData({ ...formData, nam: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                                <input type="date" value={formData.ngaybatdau}
                                    onChange={(e) => setFormData({ ...formData, ngaybatdau: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                                <input type="date" value={formData.ngayketthuc}
                                    onChange={(e) => setFormData({ ...formData, ngayketthuc: e.target.value })}
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
