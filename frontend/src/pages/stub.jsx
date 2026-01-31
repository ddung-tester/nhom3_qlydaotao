// Generic stub component for placeholder pages
export default function Stub() {
    const pageName = window.location.pathname.split('/').pop() || 'Trang';

    return (
        <div className="bg-white p-8 rounded-lg shadow">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
            </h1>
            <p className="text-gray-600">
                Trang này đang được xây dựng. Vui lòng tham khảo các trang đã hoàn thiện như Học viên, Giảng viên, Nhân viên, v.v.
            </p>
            <p className="text-gray-600 mt-2">
                Pattern CRUD tương tự: fetch data → hiển thị table → form thêm/sửa → gọi API POST/PUT/DELETE.
            </p>
        </div>
    );
}
