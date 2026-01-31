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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Học viên</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {loading ? '...' : stats.students}
                            </p>
                        </div>
                        <div className="text-4xl">👨‍🎓</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Giảng viên</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {loading ? '...' : stats.teachers}
                            </p>
                        </div>
                        <div className="text-4xl">👨‍🏫</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Khóa đào tạo</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {loading ? '...' : stats.courses}
                            </p>
                        </div>
                        <div className="text-4xl">🎓</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Lớp môn học</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {loading ? '...' : stats.classes}
                            </p>
                        </div>
                        <div className="text-4xl">🏫</div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Hệ thống Quản lý Trung tâm Đào tạo nhóm 3 - HTTT</h2>
                <p className="text-gray-600">
                    Menu bên trái để quản lý các chức năng của hệ thống.
                </p>
            </div>
        </div>
    );
}
