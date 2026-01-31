// Template CRUD component - Chương trình đào tạo
import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function ChuongTrinhList() {
    const [data, setData] = useState([]);
    const [nhanvienList, setNhanvienList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ tenct: '', mota: '', nv_quanly_id: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
        fetchNhanVien();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/chuongtrinh`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNhanVien = async () => {
        try {
            const res = await axios.get(`${API_URL}/nhanvien`);
            setNhanvienList(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/chuongtrinh/${editingId}`, formData);
            } else {
                await axios.post(`${API_URL}/chuongtrinh`, formData);
            }
            fetchData();
            resetForm();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (row) => {
        setFormData({ tenct: row.tenct, mota: row.mota || '', nv_quanly_id: row.nv_quanly_id });
        setEditingId(row.ct_id);
        setShowForm(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Xác nhận xóa?`)) {
            try {
                await axios.delete(`${API_URL}/chuongtrinh/${row.ct_id}`);
                fetchData();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({ tenct: '', mota: '', nv_quanly_id: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const columns = [
        { label: 'ID', field: 'ct_id' },
        { label: 'Tên chương trình', field: 'tenct' },
        { label: 'Mô tả', field: 'mota' },
        { label: 'NV Quản lý', field: 'ten_nv_quanly' }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Chương trình đào tạo</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {showForm ? 'Hủy' : '+ Thêm mới'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">{editingId ? 'Sửa' : 'Thêm mới'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên chương trình *</label>
                                <input type="text" required value={formData.tenct}
                                    onChange={(e) => setFormData({ ...formData, tenct: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea value={formData.mota}
                                    onChange={(e) => setFormData({ ...formData, mota: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nhân viên quản lý *</label>
                                <select required value={formData.nv_quanly_id}
                                    onChange={(e) => setFormData({ ...formData, nv_quanly_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn --</option>
                                    {nhanvienList.map((nv) => (
                                        <option key={nv.user_id} value={nv.user_id}>{nv.hoten}</option>
                                    ))}
                                </select>
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
