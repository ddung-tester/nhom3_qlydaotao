import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function PhanCongList() {
    const [data, setData] = useState([]);
    const [giangvienList, setGiangvienList] = useState([]);
    const [lopmonhocList, setLopmonhocList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ gv_id: '', lopmh_id: '', vaitro: 'GIANGVIEN' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
        fetchRelated();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/phancong`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelated = async () => {
        try {
            const [gv, lmh] = await Promise.all([
                axios.get(`${API_URL}/giangvien`),
                axios.get(`${API_URL}/lopmonhoc`)
            ]);
            setGiangvienList(gv.data);
            setLopmonhocList(lmh.data);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/phancong/${editingId}`, formData);
            } else {
                await axios.post(`${API_URL}/phancong`, formData);
            }
            fetchData();
            resetForm();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (row) => {
        setFormData({ gv_id: row.gv_id, lopmh_id: row.lopmh_id, vaitro: row.vaitro || 'GIANGVIEN' });
        setEditingId(row.pc_id);
        setShowForm(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm('Xác nhận xóa phân công?')) {
            try {
                await axios.delete(`${API_URL}/phancong/${row.pc_id}`);
                fetchData();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({ gv_id: '', lopmh_id: '', vaitro: 'GIANGVIEN' });
        setEditingId(null);
        setShowForm(false);
    };

    const columns = [
        { label: 'ID', field: 'pc_id' },
        { label: 'Giảng viên', field: 'ten_gv' },
        { label: 'Email', field: 'email_gv' },
        { label: 'Chuyên môn', field: 'chuyenmon' },
        { label: 'Khóa', field: 'tenkhoa' },
        { label: 'Môn học', field: 'tenmh' },
        { label: 'Vai trò', field: 'vaitro' }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Phân công giảng dạy</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {showForm ? 'Hủy' : '+ Thêm phân công'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">{editingId ? 'Sửa' : 'Thêm mới'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giảng viên *</label>
                                <select required value={formData.gv_id}
                                    onChange={(e) => setFormData({ ...formData, gv_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn --</option>
                                    {giangvienList.map((gv) => (
                                        <option key={gv.user_id} value={gv.user_id}>
                                            {gv.hoten} ({gv.email}) - {gv.chuyenmon}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lớp môn học *</label>
                                <select required value={formData.lopmh_id}
                                    onChange={(e) => setFormData({ ...formData, lopmh_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn --</option>
                                    {lopmonhocList.map((lmh) => (
                                        <option key={lmh.lopmh_id} value={lmh.lopmh_id}>
                                            [{lmh.lopmh_id}] {lmh.tenkhoa} - {lmh.tenmh}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò *</label>
                                <select required value={formData.vaitro}
                                    onChange={(e) => setFormData({ ...formData, vaitro: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="GIANGVIEN">Giảng viên</option>
                                    <option value="TROGIANG">Trợ giảng</option>
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
