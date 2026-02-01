import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function XepLichList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
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

    // Get unique time slots
    const timeSlots = [...new Set(data.map(d => `${d.giobd}-${d.giokt}`))].sort();

    // Get date range (grouped by week)
    const groupedByWeek = data.reduce((acc, item) => {
        const date = new Date(item.ngayhoc);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay() + 1); // Monday
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!acc[weekKey]) acc[weekKey] = [];
        acc[weekKey].push(item);
        return acc;
    }, {});

    const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

    const getScheduleCell = (weekData, dayIndex, timeSlot) => {
        const [startTime, endTime] = timeSlot.split('-');
        return weekData.find(item => {
            const itemDate = new Date(item.ngayhoc);
            const itemDay = itemDate.getDay() === 0 ? 6 : itemDate.getDay() - 1; // Convert to 0=Monday
            return itemDay === dayIndex && item.giobd === startTime;
        });
    };

    if (loading) return <div className="text-center py-8">Đang tải...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Thời khóa biểu</h1>

            {Object.keys(groupedByWeek).length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                    Chưa có lịch học nào
                </div>
            ) : (
                Object.keys(groupedByWeek).sort().reverse().map(weekKey => {
                    const weekData = groupedByWeek[weekKey];
                    const weekStart = new Date(weekKey);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);

                    return (
                        <div key={weekKey} className="mb-8 bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4 text-blue-600">
                                Tuần: {weekStart.toLocaleDateString('vi-VN')} - {weekEnd.toLocaleDateString('vi-VN')}
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-3 py-2 font-semibold text-gray-700 w-24">
                                                Giờ
                                            </th>
                                            {daysOfWeek.map(day => (
                                                <th key={day} className="border border-gray-300 px-3 py-2 font-semibold text-gray-700">
                                                    {day}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSlots.map(timeSlot => (
                                            <tr key={timeSlot}>
                                                <td className="border border-gray-300 px-3 py-2 font-medium text-center bg-gray-50">
                                                    {timeSlot}
                                                </td>
                                                {daysOfWeek.map((_, dayIndex) => {
                                                    const cell = getScheduleCell(weekData, dayIndex, timeSlot);
                                                    return (
                                                        <td key={dayIndex} className="border border-gray-300 px-2 py-2">
                                                            {cell ? (
                                                                <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-500">
                                                                    <div className="font-semibold text-blue-900">{cell.tenmh}</div>
                                                                    <div className="text-xs text-gray-600 mt-1">{cell.tenkhoa}</div>
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        📍 {cell.maphong}
                                                                    </div>
                                                                    {cell.giangvien && (
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            👨‍🏫 {cell.giangvien}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="text-gray-300 text-center">-</div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
