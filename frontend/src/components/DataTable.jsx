export default function DataTable({ columns, data, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
                            >
                                {col.label}
                            </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-gray-50 transition">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className="px-6 py-4 text-sm text-gray-900">
                                        {col.render ? col.render(row) : row[col.field]}
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex gap-2">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                            >
                                                Sửa
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(row)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
