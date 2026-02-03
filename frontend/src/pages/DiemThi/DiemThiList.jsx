import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import { handleError, handleSuccess } from '../../utils/errorHandler';

const API_URL = 'http://localhost:5000/api';

export default function DiemThiList() {
    const [data, setData] = useState([]);
    const [hocvienList, setHocvienList] = useState([]);
    const [lopmonhocList, setLopmonhocList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ hv_id: '', lopmh_id: '', lanthi: 1, diem: '', ngaythi: '' });
    const [editingIds, setEditingIds] = useState(null);

    useEffect(() => {
        fetchData();
        fetchRelated();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/diemthi`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelated = async () => {
        try {
            const [hv, lmh] = await Promise.all([
                axios.get(`${API_URL}/hocvien`),
                axios.get(`${API_URL}/lopmonhoc`)
            ]);
            setHocvienList(hv.data);
            setLopmonhocList(lmh.data);
        } catch (error) {
            handleError(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingIds) {
                await axios.put(`${API_URL}/diemthi/${editingIds.hv_id}/${editingIds.lopmh_id}/${editingIds.lanthi}`, formData);
            } else {
                await axios.post(`${API_URL}/diemthi`, formData);
            }
            fetchData();
            resetForm();
            handleSuccess(editingIds ? 'Cập nhật điểm thi thành công!' : 'Thêm điểm thi mới thành công!');
        } catch (error) {
            handleError(error);
        }
    };

    const handleEdit = (row) => {
        setFormData({
            hv_id: row.hv_id,
            lopmh_id: row.lopmh_id,
            lanthi: row.lanthi,
            diem: row.diem,
            ngaythi: row.ngaythi?.split('T')[0] || ''
        });
        setEditingIds({ hv_id: row.hv_id, lopmh_id: row.lopmh_id, lanthi: row.lanthi });
        setShowForm(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm('Xác nhận xóa điểm thi?')) {
            try {
                await axios.delete(`${API_URL}/diemthi/${row.hv_id}/${row.lopmh_id}/${row.lanthi}`);
                fetchData();
                handleSuccess('Xóa điểm thi thành công!');
            } catch (error) {
                handleError(error);
            }
        }
    };

    const resetForm = () => {
        setFormData({ hv_id: '', lopmh_id: '', lanthi: 1, diem: '', ngaythi: '' });
        setEditingIds(null);
        setShowForm(false);
    };

    const columns = [
        { label: 'Học viên', field: 'hoten' },
        { label: 'Email', field: 'email' },
        { label: 'Khóa', field: 'tenkhoa' },
        { label: 'Môn học', field: 'tenmh' },
        { label: 'Lần thi', field: 'lanthi' },
        { label: 'Điểm', field: 'diem' },
        { label: 'Ngày thi', field: 'ngaythi', render: (row) => row.ngaythi?.split('T')[0] }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Điểm thi</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {showForm ? 'Hủy' : '+ Thêm điểm thi'}
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
                                        <option key={hv.user_id} value={hv.user_id}>
                                            {hv.hoten} ({hv.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lớp học *</label>
                                <select required value={formData.lopmh_id} disabled={!!editingIds}
                                    onChange={(e) => setFormData({ ...formData, lopmh_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn --</option>
                                    {lopmonhocList.map((lmh) => (
                                        <option key={lmh.lopmh_id} value={lmh.lopmh_id}>
                                            {lmh.tenkhoa} - {lmh.tenmh} (ID: {lmh.lopmh_id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lần thi *</label>
                                <input type="number" required min="1" value={formData.lanthi} disabled={!!editingIds}
                                    onChange={(e) => setFormData({ ...formData, lanthi: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Điểm</label>
                                <input type="number" step="0.1" min="0" max="10" value={formData.diem}
                                    onChange={(e) => setFormData({ ...formData, diem: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày thi</label>
                                <input type="date" value={formData.ngaythi}
                                    onChange={(e) => setFormData({ ...formData, ngaythi: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
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
