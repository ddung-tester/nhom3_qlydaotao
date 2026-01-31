import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function XepLichList() {
    const [data, setData] = useState([]);
    const [buoihocList, setBuoihocList] = useState([]);
    const [lopmonhocList, setLopmonhocList] = useState([]);
    const [phonghocList, setPhonghocList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ buoihoc_id: '', lopmh_id: '', ph_id: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
        fetchRelated();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/xeplich`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelated = async () => {
        try {
            const [bh, lmh, ph] = await Promise.all([
                axios.get(`${API_URL}/buoihoc`),
                axios.get(`${API_URL}/lopmonhoc`),
                axios.get(`${API_URL}/phonghoc`)
            ]);
            setBuoihocList(bh.data);
            setLopmonhocList(lmh.data);
            setPhonghocList(ph.data);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/xeplich/${editingId}`, formData);
            } else {
                await axios.post(`${API_URL}/xeplich`, formData);
            }
            fetchData();
            resetForm();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (row) => {
        setFormData({ buoihoc_id: row.buoihoc_id, lopmh_id: row.lopmh_id, ph_id: row.ph_id });
        setEditingId(row.buoihoc_id);
        setShowForm(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm('Xác nhận xóa lịch?')) {
            try {
                await axios.delete(`${API_URL}/xeplich/${row.buoihoc_id}`);
                fetchData();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({ buoihoc_id: '', lopmh_id: '', ph_id: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const columns = [
        { label: 'Ngày', field: 'ngayhoc', render: (row) => row.ngayhoc?.split('T')[0] },
        { label: 'Giờ', render: (row) => `${row.giobd} - ${row.giokt}` },
        { label: 'Khóa', field: 'tenkhoa' },
        { label: 'Môn học', field: 'tenmh' },
        { label: 'Phòng', field: 'maphong' }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Xếp lịch</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {showForm ? 'Hủy' : '+ Thêm lịch'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">{editingId ? 'Sửa' : 'Thêm mới'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Buổi học *</label>
                                <select required value={formData.buoihoc_id} disabled={!!editingId}
                                    onChange={(e) => setFormData({ ...formData, buoihoc_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn --</option>
                                    {buoihocList.map((bh) => (
                                        <option key={bh.buoihoc_id} value={bh.buoihoc_id}>
                                            {bh.ngayhoc?.split('T')[0]} ({bh.giobd} - {bh.giokt})
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
                                            {lmh.tenkhoa} - {lmh.tenmh}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phòng học *</label>
                                <select required value={formData.ph_id}
                                    onChange={(e) => setFormData({ ...formData, ph_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Chọn --</option>
                                    {phonghocList.map((ph) => (
                                        <option key={ph.ph_id} value={ph.ph_id}>
                                            {ph.maphong} - {ph.diadiem}
                                        </option>
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
