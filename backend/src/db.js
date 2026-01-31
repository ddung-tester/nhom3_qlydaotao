import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Tạo connection pool đến PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'training_center',
});

// Kiểm tra kết nối
pool.on('connect', () => {
  console.log('✓ Đã kết nối tới PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Lỗi PostgreSQL:', err);
});

export default pool;
