// Test script để kiểm tra API báo cáo kết quả học tập
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/reports/student-results';

async function testStudentResults() {
    console.log('=== Testing Student Results API ===\n');

    try {
        console.log(`Calling: ${API_URL}`);
        const response = await axios.get(API_URL);

        console.log(`\nStatus: ${response.status}`);
        console.log(`\nData count: ${response.data.length} records`);

        if (response.data.length > 0) {
            console.log('\n=== Sample Data ===');
            console.log(JSON.stringify(response.data[0], null, 2));

            console.log('\n=== All Data ===');
            response.data.forEach((row, index) => {
                console.log(`\n[${index + 1}] ${row.hoten} - ${row.tenkhoa}`);
                console.log(`    Email: ${row.email}`);
                console.log(`    Môn học: ${row.tenmh || 'N/A'}`);
                console.log(`    Điểm: ${row.diem_cao_nhat || 'N/A'}`);
                console.log(`    Trạng thái: ${row.trangthai}`);
            });
        } else {
            console.log('\n⚠️ NO DATA RETURNED');
            console.log('Possible issues:');
            console.log('1. No students with status HOAN_THANH in database');
            console.log('2. Database connection issue');
            console.log('3. Query error');
        }

    } catch (error) {
        console.error('\n❌ ERROR:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        } else if (error.request) {
            console.error('No response from server. Is backend running on port 5000?');
        } else {
            console.error(error.message);
        }
    }
}

testStudentResults();
