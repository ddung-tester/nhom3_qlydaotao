import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';
import { handleError, handleSuccess } from '../../utils/errorHandler';

const API_URL = 'http://localhost:5000/api';

export default function KhoaDaoTaoList() {
    const [data, setData] = useState([]);
    const [chuongtrinhList, setChuongtrinhList] = useState([]);
    const [kyhocList, setKyhocList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ ct_id: '', ky_id: '', tenkhoa: '', ngaykhaigiang: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
        fetchRelated();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/khoadaotao`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelated = async () => {
        try {
            const [ct, ky] = await Promise.all([
                axios.get(`${API_URL}/chuongtrinh`),
                axios.get(`${API_URL}/kyhoc`)
            ]);
            setChuongtrinhList(ct.data);
            setKyhocList(ky.data);
        } catch (error) {
            handleError(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/khoadaotao/${editingId}`, formData);
            } else {
                await axios.post(`${API_URL}/khoadaotao`, formData);
            }
            fetchData();
            resetForm();
            handleSuccess(editingId ? 'Cập nhật khóa đào tạo thành công!' : 'Thêm khóa đào tạo mới thành công!');
        } catch (error) {
            handleError(error);
        }
    };

    const handleEdit = (row) => {
        setFormData({
            ct_id: row.ct_id,
            ky_id: row.ky_id,
            tenkhoa: row.tenkhoa,
            ngaykhaigiang: row.ngaykhaigiang?.split('T')[0] || ''
        });
        setEditingId(row.kdt_id);
        setShowForm(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Xác nhận xóa khóa ${row.tenkhoa}?`)) {
            try {
                await axios.delete(`${API_URL}/khoadaotao/${row.kdt_id}`);
                fetchData();
                handleSuccess('Xóa khóa đào tạo thành công!');
            } catch (error) {
                handleError(error);
            }
        }
    };

    const resetForm = () => {
        setFormData({ ct_id: '', ky_id: '', tenkhoa: '', ngaykhaigiang: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const columns = [
        { label: 'ID', field: 'kdt_id' },
        { label: 'Tên khóa', field: 'tenkhoa' },
        { label: 'Chương trình', field: 'tenct' },
        { label: 'Kỳ học', render: (row) => `${row.hocky} - ${row.nam}` },
        { label: 'Ngày khai giảng', field: 'ngaykhaigiang', render: (row) => row.ngaykhaigiang?.split('T')[0] }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Khóa đào tạo</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {showForm ? 'Hủy' : '+ Thêm khóa đào tạo'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">{editingId ? 'Sửa khóa đào tạo' : 'Thêm mới'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Chương trình *</label>
                                <select required value={formData.ct_id}
                                    onChange={(e) => setFormData({ ...formData, ct_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn chương trình --</option>
                                    {chuongtrinhList.map((ct) => (
                                        <option key={ct.ct_id} value={ct.ct_id}>{ct.tenct}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kỳ học *</label>
                                <select required value={formData.ky_id}
                                    onChange={(e) => setFormData({ ...formData, ky_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn kỳ học --</option>
                                    {kyhocList.map((ky) => (
                                        <option key={ky.ky_id} value={ky.ky_id}>{ky.hocky} - {ky.nam}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên khóa *</label>
                                <input type="text" required value={formData.tenkhoa}
                                    onChange={(e) => setFormData({ ...formData, tenkhoa: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khai giảng</label>
                                <input type="date" value={formData.ngaykhaigiang}
                                    onChange={(e) => setFormData({ ...formData, ngaykhaigiang: e.target.value })}
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
