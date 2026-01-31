export default function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Trang chủ</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Học viên</p>
                            <p className="text-2xl font-bold text-gray-800">---</p>
                        </div>
                        <div className="text-4xl">👨‍🎓</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Giảng viên</p>
                            <p className="text-2xl font-bold text-gray-800">---</p>
                        </div>
                        <div className="text-4xl">👨‍🏫</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Khóa đào tạo</p>
                            <p className="text-2xl font-bold text-gray-800">---</p>
                        </div>
                        <div className="text-4xl">🎓</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Lớp môn học</p>
                            <p className="text-2xl font-bold text-gray-800">---</p>
                        </div>
                        <div className="text-4xl">🏫</div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Chào mừng đến với Hệ thống Quản lý Trung tâm Đào tạo</h2>
                <p className="text-gray-600">
                    Sử dụng menu bên trái để quản lý các chức năng của hệ thống.
                </p>
            </div>
        </div>
    );
}
