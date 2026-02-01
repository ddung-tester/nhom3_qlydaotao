import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Trang chủ', icon: '🏠' },
        {
            label: 'Quản lý Nhân sự',
            items: [
                { path: '/hocvien', label: 'Học viên', icon: '👨‍🎓' },
                { path: '/giangvien', label: 'Giảng viên', icon: '👨‍🏫' },
                { path: '/nhanvien', label: 'Nhân viên', icon: '👔' },
            ]
        },
        {
            label: '📚 CHƯƠNG TRÌNH',
            items: [
                { path: '/chuongtrinh', label: 'Chương trình đào tạo', icon: '📚' },
                { path: '/monhoc', label: 'Môn học', icon: '📖' },
                { path: '/kyhoc', label: 'Kỳ học', icon: '📅' },
                { path: '/khoadaotao', label: 'Khóa đào tạo', icon: '🎓' },
                { path: '/lopmonhoc', label: 'Lớp học', icon: '🏫' },
            ]
        },
        {
            label: '🏢 HẠ TẦNG',
            items: [
                { path: '/phonghoc', label: 'Phòng học', icon: '🚪' },
            ]
        },
        {
            label: '🕒 VẬN HÀNH GIẢNG DẠY',
            items: [
                { path: '/buoihoc', label: 'Buổi học', icon: '⏰' },
                { path: '/phancong', label: 'Phân công giảng dạy', icon: '👥' },
                { path: '/xeplich', label: 'Thời khóa biểu', icon: '📆' },
            ]
        },
        {
            label: '🎓 HỌC VỤ',
            items: [
                { path: '/dangkykhoa', label: 'Đăng ký khóa', icon: '📝' },
                { path: '/diemthi', label: 'Điểm thi', icon: '📊' },
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
        <aside className="w-64 bg-white shadow-md h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200">
            <nav className="py-8 px-4">
                {menuItems.map((section, idx) => (
                    <div key={idx} className="mb-8">
                        {section.path ? (
                            <Link
                                to={section.path}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive(section.path)
                                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-xl">{section.icon}</span>
                                <span className="font-medium">{section.label}</span>
                            </Link>
                        ) : (
                            <>
                                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">
                                    {section.label}
                                </h3>
                                <div className="space-y-1.5">
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm ${isActive(item.path)
                                                ? 'bg-blue-50 text-blue-600 font-bold shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
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
