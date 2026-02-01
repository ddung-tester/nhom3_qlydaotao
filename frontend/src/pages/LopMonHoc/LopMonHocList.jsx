import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function LopMonHocList() {
    const [data, setData] = useState([]);
    const [khoadaotaoList, setKhoadaotaoList] = useState([]);
    const [monhocList, setMonhocList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ kdt_id: '', mh_ma: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
        fetchRelated();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/lopmonhoc`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelated = async () => {
        try {
            const [kdt, mh] = await Promise.all([
                axios.get(`${API_URL}/khoadaotao`),
                axios.get(`${API_URL}/monhoc`)
            ]);
            setKhoadaotaoList(kdt.data);
            setMonhocList(mh.data);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/lopmonhoc/${editingId}`, formData);
            } else {
                await axios.post(`${API_URL}/lopmonhoc`, formData);
            }
            fetchData();
            resetForm();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (row) => {
        setFormData({ kdt_id: row.kdt_id, mh_ma: row.mh_ma });
        setEditingId(row.lopmh_id);
        setShowForm(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm('Xác nhận xóa lớp môn học?')) {
            try {
                await axios.delete(`${API_URL}/lopmonhoc/${row.lopmh_id}`);
                fetchData();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({ kdt_id: '', mh_ma: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const columns = [
        { label: 'ID', field: 'lopmh_id' },
        { label: 'Khóa đào tạo', field: 'tenkhoa' },
        { label: 'Môn học', field: 'tenmh' },
        { label: 'Mã MH', field: 'mh_ma' }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Lớp học</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {showForm ? 'Hủy' : '+ Thêm lớp môn học'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">{editingId ? 'Sửa' : 'Thêm mới'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Khóa đào tạo *</label>
                                <select required value={formData.kdt_id}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Môn học *</label>
                                <select required value={formData.mh_ma}
                                    onChange={(e) => setFormData({ ...formData, mh_ma: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn --</option>
                                    {monhocList.map((mh) => (
                                        <option key={mh.mh_ma} value={mh.mh_ma}>{mh.tenmh}</option>
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
