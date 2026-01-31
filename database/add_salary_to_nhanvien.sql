-- Migration: Add luongcung to nhanvien table
ALTER TABLE nhanvien ADD COLUMN IF NOT EXISTS luongcung NUMERIC DEFAULT 0;

-- Update sample data if needed
UPDATE nhanvien SET luongcung = 12000000 WHERE user_id = 1;
UPDATE nhanvien SET luongcung = 10000000 WHERE user_id = 2;
UPDATE nhanvien SET luongcung = 8000000 WHERE user_id = 3;
