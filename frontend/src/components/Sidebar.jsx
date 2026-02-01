import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Trang chủ', icon: '🏠' },
        {
            label: 'Quản lý',
            items: [
                { path: '/hocvien', label: 'Học viên', icon: '👨‍🎓' },
                { path: '/giangvien', label: 'Giảng viên', icon: '👨‍🏫' },
                { path: '/nhanvien', label: 'Nhân viên', icon: '👔' },
            ]
        },
        {
            label: 'Chương trình',
            items: [
                { path: '/chuongtrinh', label: 'Chương trình đào tạo', icon: '📚' },
                { path: '/monhoc', label: 'Môn học', icon: '📖' },
                { path: '/kyhoc', label: 'Kỳ học', icon: '📅' },
                { path: '/khoadaotao', label: 'Khóa đào tạo', icon: '🎓' },
                { path: '/lopmonhoc', label: 'Lớp học', icon: '🏫' },
            ]
        },
        {
            label: 'Học vụ',
            items: [
                { path: '/dangkykhoa', label: 'Đăng ký khóa', icon: '📝' },
                { path: '/diemthi', label: 'Điểm thi', icon: '📊' },
                { path: '/phancong', label: 'Phân công giảng dạy', icon: '👥' },
            ]
        },
        {
            label: 'Lịch học',
            items: [
                { path: '/buoihoc', label: 'Buổi học', icon: '⏰' },
                { path: '/phonghoc', label: 'Phòng học', icon: '🚪' },
                { path: '/xeplich', label: 'Thời khóa biểu', icon: '📆' },
            ]
        },
        {
            label: 'Báo cáo',
            items: [
                { path: '/reports/student-results', label: 'Kết quả học tập', icon: '📈' },
                { path: '/reports/incomplete-students', label: 'HV chưa hoàn thành', icon: '⚠️' },
                { path: '/reports/teacher-payroll', label: 'Lương giảng viên', icon: '💰' },
                { path: '/reports/staff-payroll', label: 'Lương nhân viên', icon: '💵' },
            ]
        },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 bg-white shadow-md h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="p-4">
                {menuItems.map((section, idx) => (
                    <div key={idx} className="mb-4">
                        {section.path ? (
                            <Link
                                to={section.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive(section.path)
                                    ? 'bg-blue-100 text-blue-600 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span>{section.icon}</span>
                                <span>{section.label}</span>
                            </Link>
                        ) : (
                            <>
                                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">
                                    {section.label}
                                </h3>
                                <div className="space-y-1">
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm ${isActive(item.path)
                                                ? 'bg-blue-100 text-blue-600 font-semibold'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <span>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
}
