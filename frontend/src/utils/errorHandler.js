import { toast } from 'react-toastify';

export const handleError = (error) => {
    let message = 'Có lỗi xảy ra, vui lòng thử lại.';

    if (error.response) {
        // Lỗi từ backend trả về
        const data = error.response.data;
        const status = error.response.status;

        if (data && data.error) {
            message = data.error;

            // Xử lý các lỗi cụ thể từ Postgres/Backend
            if (message.includes('duplicate key value violates unique constraint')) {
                if (message.includes('Email') || message.includes('email')) {
                    message = 'Email này đã được sử dụng bởi người dùng khác.';
                } else if (message.includes('SDT') || message.includes('sodienthoai')) {
                    message = 'Số điện thoại này đã được sử dụng.';
                } else if (message.includes('MaPhong')) {
                    message = 'Mã phòng này đã tồn tại.';
                } else if (message.includes('MaMon')) {
                    message = 'Mã môn học này đã tồn tại.';
                } else if (message.includes('MaCT')) {
                    message = 'Mã chương trình này đã tồn tại.';
                } else if (message.includes('MaKy')) {
                    message = 'Mã kỳ học này đã tồn tại.';
                } else {
                    message = 'Dữ liệu này đã tồn tại trong hệ thống (trùng lặp).';
                }
            } else if (message.includes('violates foreign key constraint') || message.includes('foreign key')) {
                if (message.includes('delete') || message.includes('DELETE')) {
                    message = 'Không thể xóa vì dữ liệu này đang được sử dụng ở nơi khác trong hệ thống.';
                } else {
                    message = 'Dữ liệu tham chiếu không hợp lệ. Vui lòng kiểm tra lại.';
                }
            } else if (message.includes('violates check constraint') || message.includes('check constraint')) {
                message = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các giá trị đã nhập.';
            } else if (message.includes('violates not-null constraint') || message.includes('null value')) {
                message = 'Vui lòng điền đầy đủ các trường bắt buộc.';
            }
        } else if (status === 401) {
            message = 'Phiên đăng nhập hết hạn hoặc bạn không có quyền thực hiện thao tác này.';
        } else if (status === 403) {
            message = 'Bạn không có quyền truy cập tài nguyên này.';
        } else if (status === 404) {
            message = 'Không tìm thấy dữ liệu yêu cầu.';
        } else if (status === 500) {
            message = 'Lỗi hệ thống máy chủ. Vui lòng thử lại sau.';
        } else if (status === 400) {
            message = data.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
        }
    } else if (error.request) {
        // Không nhận được phản hồi từ server
        message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng.';
    } else {
        // Lỗi khi setup request
        message = error.message;
    }

    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

export const handleSuccess = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};
