import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        courses: 0,
        classes: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Trang chủ</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Học viên</p>
                            <p className="text-3xl font-extrabold text-gray-800">
                                {loading ? '...' : stats.students}
                            </p>
                        </div>
                        <div className="text-4xl bg-blue-50 p-3 rounded-xl">👨‍🎓</div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Giảng viên</p>
                            <p className="text-3xl font-extrabold text-gray-800">
                                {loading ? '...' : stats.teachers}
                            </p>
                        </div>
                        <div className="text-4xl bg-green-50 p-3 rounded-xl">👨‍🏫</div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Khóa đào tạo</p>
                            <p className="text-3xl font-extrabold text-gray-800">
                                {loading ? '...' : stats.courses}
                            </p>
                        </div>
                        <div className="text-4xl bg-purple-50 p-3 rounded-xl">🎓</div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Lớp học</p>
                            <p className="text-3xl font-extrabold text-gray-800">
                                {loading ? '...' : stats.classes}
                            </p>
                        </div>
                        <div className="text-4xl bg-orange-50 p-3 rounded-xl">🏫</div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Nhóm 3 - Hệ thống Quản lý Trung tâm Đào tạo</h2>
                <p className="text-gray-500 leading-relaxed max-w-2xl">
                    Chào mừng bạn quay trở lại. Sử dụng menu điều hướng bên trái để truy cập các chức năng quản lý,
                    vận hành giảng dạy và báo cáo thống kê.
                </p>
            </div>
        </div>
    );
}
