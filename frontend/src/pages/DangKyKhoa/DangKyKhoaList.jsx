import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function DangKyKhoaList() {
    const [data, setData] = useState([]);
    const [hocvienList, setHocvienList] = useState([]);
    const [khoadaotaoList, setKhoadaotaoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ hv_id: '', kdt_id: '', ngaydk: '', trangthai: 'DANG_HOC' });
    const [editingIds, setEditingIds] = useState(null);

    useEffect(() => {
        fetchData();
        fetchRelated();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/dangkykhoa`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelated = async () => {
        try {
            const [hv, kdt] = await Promise.all([
                axios.get(`${API_URL}/hocvien`),
                axios.get(`${API_URL}/khoadaotao`)
            ]);
            setHocvienList(hv.data);
            setKhoadaotaoList(kdt.data);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingIds) {
                await axios.put(`${API_URL}/dangkykhoa/${editingIds.hv_id}/${editingIds.kdt_id}`, formData);
            } else {
                await axios.post(`${API_URL}/dangkykhoa`, formData);
            }
            fetchData();
            resetForm();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (row) => {
        setFormData({
            hv_id: row.hv_id,
            kdt_id: row.kdt_id,
            ngaydk: row.ngaydk?.split('T')[0] || '',
            trangthai: row.trangthai || 'DANG_HOC'
        });
        setEditingIds({ hv_id: row.hv_id, kdt_id: row.kdt_id });
        setShowForm(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm('Xác nhận xóa đăng ký?')) {
            try {
                await axios.delete(`${API_URL}/dangkykhoa/${row.hv_id}/${row.kdt_id}`);
                fetchData();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({ hv_id: '', kdt_id: '', ngaydk: '', trangthai: 'DANG_HOC' });
        setEditingIds(null);
        setShowForm(false);
    };

    const columns = [
        { label: 'Học viên', field: 'hoten' },
        { label: 'Khóa', field: 'tenkhoa' },
        { label: 'Ngày ĐK', field: 'ngaydk', render: (row) => row.ngaydk?.split('T')[0] },
        { label: 'Trạng thái', field: 'trangthai' }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Đăng ký khóa học</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {showForm ? 'Hủy' : '+ Thêm đăng ký'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">{editingIds ? 'Sửa' : 'Thêm mới'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Học viên *</label>
                                <select required value={formData.hv_id} disabled={!!editingIds}
                                    onChange={(e) => setFormData({ ...formData, hv_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn --</option>
                                    {hocvienList.map((hv) => (
                                        <option key={hv.user_id} value={hv.user_id}>{hv.hoten}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Khóa đào tạo *</label>
                                <select required value={formData.kdt_id} disabled={!!editingIds}
                                    onChange={(e) => setFormData({ ...formData, kdt_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn --</option>
                                    {khoadaotaoList.map((kdt) => (
                                        <option key={kdt.kdt_id} value={kdt.kdt_id}>{kdt.tenkhoa}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đăng ký</label>
                                <input type="date" value={formData.ngaydk}
                                    onChange={(e) => setFormData({ ...formData, ngaydk: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                <select value={formData.trangthai}
                                    onChange={(e) => setFormData({ ...formData, trangthai: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="DANG_HOC">Đang học</option>
                                    <option value="HOAN_THANH">Hoàn thành</option>
                                    <option value="DA_HUY">Đã hủy</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Hủy</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingIds ? 'Cập nhật' : 'Thêm'}</button>
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
