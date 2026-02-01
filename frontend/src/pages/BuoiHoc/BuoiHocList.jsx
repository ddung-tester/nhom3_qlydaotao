import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function BuoiHocList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ ngayhoc: '', giobd: '', giokt: '', lopmh_id: '', ph_id: '' });
    const [editingId, setEditingId] = useState(null);
    const [lopMonHocList, setLopMonHocList] = useState([]);
    const [phongHocList, setPhongHocList] = useState([]);

    useEffect(() => {
        fetchData();
        fetchLopMonHoc();
        fetchPhongHoc();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/buoihoc`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLopMonHoc = async () => {
        try {
            const res = await axios.get(`${API_URL}/lopmonhoc`);
            setLopMonHocList(res.data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách lớp môn học:', error);
        }
    };

    const fetchPhongHoc = async () => {
        try {
            const res = await axios.get(`${API_URL}/phonghoc`);
            setPhongHocList(res.data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách phòng học:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate: giờ kết thúc > giờ bắt đầu
        if (formData.giobd && formData.giokt && formData.giobd >= formData.giokt) {
            alert('Giờ kết thúc phải lớn hơn giờ bắt đầu!');
            return;
        }

        try {
            if (editingId) {
                await axios.put(`${API_URL}/buoihoc/${editingId}`, formData);
            } else {
                await axios.post(`${API_URL}/buoihoc`, formData);
            }
            fetchData();
            resetForm();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (row) => {
        setFormData({
            ngayhoc: row.ngayhoc?.split('T')[0] || '',
            giobd: row.giobd,
            giokt: row.giokt,
            lopmh_id: row.lopmh_id || '',
            ph_id: row.ph_id || ''
        });
        setEditingId(row.buoihoc_id);
        setShowForm(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm('Xác nhận xóa buổi học?')) {
            try {
                await axios.delete(`${API_URL}/buoihoc/${row.buoihoc_id}`);
                fetchData();
            } catch (error) {
                alert('Lỗi: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({ ngayhoc: '', giobd: '', giokt: '', lopmh_id: '', ph_id: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const columns = [
        { label: 'Ngày học', field: 'ngayhoc', render: (row) => row.ngayhoc?.split('T')[0] },
        {
            label: 'Thời gian',
            render: (row) => `${row.giobd} - ${row.giokt}`
        },
        { label: 'Môn học', field: 'tenmh', render: (row) => row.tenmh || <span className="text-gray-400">N/A</span> },
        { label: 'Phòng học', field: 'maphong', render: (row) => row.maphong || <span className="text-gray-400">N/A</span> },
        {
            label: 'Trạng thái phân công',
            render: (row) => row.giangvien ?
                <span className="text-green-600 font-medium">Đã phân công</span> :
                <span className="text-orange-500 font-medium">Chưa phân công</span>
        }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Quản lý Buổi học</h1>
                <button onClick={() => setShowForm(!showForm)} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95">
                    {showForm ? 'Hủy' : '+ Thêm buổi học'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                        {editingId ? '📝 Cập nhật buổi học' : '✨ Thêm buổi học mới'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày học *</label>
                                <input type="date" required value={formData.ngayhoc}
                                    onChange={(e) => setFormData({ ...formData, ngayhoc: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ bắt đầu *</label>
                                    <input type="time" required value={formData.giobd}
                                        onChange={(e) => setFormData({ ...formData, giobd: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ kết thúc *</label>
                                    <input type="time" required value={formData.giokt}
                                        onChange={(e) => setFormData({ ...formData, giokt: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lớp học *</label>
                                <select required value={formData.lopmh_id}
                                    onChange={(e) => setFormData({ ...formData, lopmh_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">-- Chọn lớp học --</option>
                                    {lopMonHocList.map(lop => (
                                        <option key={lop.lopmh_id} value={lop.lopmh_id}>
                                            {lop.tenmh} - {lop.tenkhoa}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phòng học *</label>
                                <select required value={formData.ph_id}
                                    onChange={(e) => setFormData({ ...formData, ph_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">-- Chọn phòng học --</option>
                                    {phongHocList.map(phong => (
                                        <option key={phong.ph_id} value={phong.ph_id}>
                                            {phong.maphong} - {phong.diadiem}
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
