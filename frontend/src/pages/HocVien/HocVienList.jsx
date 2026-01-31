import { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../../components/DataTable';

const API_URL = 'http://localhost:5000/api';

export default function HocVienList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        hoten: '',
        ngaysinh: '',
        email: '',
        diachi: '',
        sodienthoai: ['']
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/hocvien`);
            setData(res.data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Lọc bỏ số điện thoại rỗng
            const cleanedData = {
                ...formData,
                sodienthoai: formData.sodienthoai.filter(s => s.trim() !== '')
            };

            if (editingId) {
                await axios.put(`${API_URL}/hocvien/${editingId}`, cleanedData);
            } else {
                await axios.post(`${API_URL}/hocvien`, cleanedData);
            }
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Lỗi khi lưu:', error);
            alert('Có lỗi xảy ra: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (row) => {
        setFormData({
            hoten: row.hoten,
            ngaysinh: row.ngaysinh?.split('T')[0] || '',
            email: row.email || '',
            diachi: row.diachi || '',
            sodienthoai: row.sodienthoai || ['']
        });
        setEditingId(row.user_id);
        setShowForm(true);
    };

    const handleDelete = async (row) => {
        if (window.confirm(`Xác nhận xóa học viên ${row.hoten}?`)) {
            try {
                await axios.delete(`${API_URL}/hocvien/${row.user_id}`);
                fetchData();
            } catch (error) {
                console.error('Lỗi khi xóa:', error);
                alert('Có lỗi xảy ra: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({
            hoten: '',
            ngaysinh: '',
            email: '',
            diachi: '',
            sodienthoai: ['']
        });
        setEditingId(null);
        setShowForm(false);
    };

    const addPhoneField = () => {
        setFormData(prev => ({
            ...prev,
            sodienthoai: [...prev.sodienthoai, '']
        }));
    };

    const removePhoneField = (index) => {
        setFormData(prev => ({
            ...prev,
            sodienthoai: prev.sodienthoai.filter((_, i) => i !== index)
        }));
    };

    const updatePhone = (index, value) => {
        const newPhones = [...formData.sodienthoai];
        newPhones[index] = value;
        setFormData(prev => ({ ...prev, sodienthoai: newPhones }));
    };

    const columns = [
        { label: 'ID', field: 'user_id' },
        { label: 'Họ tên', field: 'hoten' },
        { label: 'Ngày sinh', field: 'ngaysinh', render: (row) => row.ngaysinh?.split('T')[0] },
        { label: 'Email', field: 'email' },
        { label: 'Địa chỉ', field: 'diachi' },
        {
            label: 'Số điện thoại',
            render: (row) => row.sodienthoai?.filter(s => s).join(', ') || ''
        }
    ];

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Học viên</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? 'Hủy' : '+ Thêm học viên'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? 'Sửa học viên' : 'Thêm học viên mới'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.hoten}
                                    onChange={(e) => setFormData({ ...formData, hoten: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    value={formData.ngaysinh}
                                    onChange={(e) => setFormData({ ...formData, ngaysinh: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    value={formData.diachi}
                                    onChange={(e) => setFormData({ ...formData, diachi: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số điện thoại
                            </label>
                            {formData.sodienthoai.map((phone, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => updatePhone(index, e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {formData.sodienthoai.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePhoneField(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addPhoneField}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                + Thêm số điện thoại
                            </button>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
