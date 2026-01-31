-- Migration: Change column mota to nganh in chuongtrinh table
-- Run this SQL in PostgreSQL to update the database schema

ALTER TABLE chuongtrinh RENAME COLUMN mota TO nganh;

-- Update existing data if needed (optional - converts NULL to empty string)
UPDATE chuongtrinh SET nganh = '' WHERE nganh IS NULL;
