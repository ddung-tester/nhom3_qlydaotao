-- Schema PostgreSQL cho Hệ thống quản lý trung tâm đào tạo

DROP TABLE IF EXISTS xeplich CASCADE;
DROP TABLE IF EXISTS phonghoc CASCADE;
DROP TABLE IF EXISTS buoihoc CASCADE;
DROP TABLE IF EXISTS phancong CASCADE;
DROP TABLE IF EXISTS diemthi CASCADE;
DROP TABLE IF EXISTS dangkykhoa CASCADE;
DROP TABLE IF EXISTS lopmonhoc CASCADE;
DROP TABLE IF EXISTS khoadaotao CASCADE;
DROP TABLE IF EXISTS kyhoc CASCADE;
DROP TABLE IF EXISTS monhoc CASCADE;
DROP TABLE IF EXISTS chuongtrinh CASCADE;
DROP TABLE IF EXISTS giangvien CASCADE;
DROP TABLE IF EXISTS nhanvien CASCADE;
DROP TABLE IF EXISTS hocvien CASCADE;
DROP TABLE IF EXISTS user_sdt CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Bảng User (CHỈ bảng này viết hoa và dùng dấu ")
CREATE TABLE "User" (
  user_id SERIAL PRIMARY KEY,
  hoten VARCHAR,
  ngaysinh DATE,
  email VARCHAR
);

CREATE TABLE user_sdt (
  user_id INT NOT NULL REFERENCES "User"(user_id),
  sdt VARCHAR NOT NULL,
  PRIMARY KEY (user_id, sdt)
);

CREATE TABLE hocvien (
  user_id INT PRIMARY KEY REFERENCES "User"(user_id),
  diachi VARCHAR
);

CREATE TABLE nhanvien (
  user_id INT PRIMARY KEY REFERENCES "User"(user_id),
  ngayvaolam DATE,
  quanly_id INT REFERENCES nhanvien(user_id),
  CONSTRAINT no_self_management CHECK (user_id != quanly_id)
);

CREATE TABLE giangvien (
  user_id INT PRIMARY KEY REFERENCES "User"(user_id),
  chuyenmon VARCHAR
);

CREATE TABLE chuongtrinh (
  ct_id SERIAL PRIMARY KEY,
  tenct VARCHAR,
  mota VARCHAR,
  nv_quanly_id INT NOT NULL REFERENCES nhanvien(user_id)
);

CREATE TABLE monhoc (
  mh_ma VARCHAR PRIMARY KEY,
  ct_id INT NOT NULL REFERENCES chuongtrinh(ct_id),
  tenmh VARCHAR,
  sogio INT,
  UNIQUE (ct_id, tenmh)
);

CREATE TABLE kyhoc (
  ky_id SERIAL PRIMARY KEY,
  hocky VARCHAR,
  nam INT,
  ngaybatdau DATE,
  ngayketthuc DATE,
  UNIQUE (hocky, nam)
);

CREATE TABLE khoadaotao (
  kdt_id SERIAL PRIMARY KEY,
  ct_id INT NOT NULL REFERENCES chuongtrinh(ct_id),
  ky_id INT NOT NULL REFERENCES kyhoc(ky_id),
  tenkhoa VARCHAR,
  ngaykhaigiang DATE,
  UNIQUE (ct_id, ky_id)
);

CREATE TABLE lopmonhoc (
  lopmh_id SERIAL PRIMARY KEY,
  kdt_id INT NOT NULL REFERENCES khoadaotao(kdt_id),
  mh_ma VARCHAR NOT NULL REFERENCES monhoc(mh_ma)
);

CREATE TABLE dangkykhoa (
  hv_id INT NOT NULL REFERENCES hocvien(user_id),
  kdt_id INT NOT NULL REFERENCES khoadaotao(kdt_id),
  ngaydk DATE,
  trangthai VARCHAR,
  PRIMARY KEY (hv_id, kdt_id)
);

CREATE TABLE diemthi (
  hv_id INT NOT NULL REFERENCES hocvien(user_id),
  lopmh_id INT NOT NULL REFERENCES lopmonhoc(lopmh_id),
  lanthi INT NOT NULL,
  diem NUMERIC,
  ngaythi DATE,
  PRIMARY KEY (hv_id, lopmh_id, lanthi)
);

CREATE TABLE phancong (
  pc_id SERIAL PRIMARY KEY,
  gv_id INT NOT NULL REFERENCES giangvien(user_id),
  lopmh_id INT NOT NULL REFERENCES lopmonhoc(lopmh_id),
  vaitro VARCHAR -- 'GIANGVIEN' | 'TROGIANG'
);

CREATE TABLE buoihoc (
  buoihoc_id SERIAL PRIMARY KEY,
  ngayhoc DATE,
  giobd TIME,
  giokt TIME
);

CREATE TABLE phonghoc (
  ph_id SERIAL PRIMARY KEY,
  diadiem VARCHAR,
  maphong VARCHAR
);

CREATE TABLE xeplich (
  buoihoc_id INT PRIMARY KEY REFERENCES buoihoc(buoihoc_id),
  lopmh_id INT NOT NULL REFERENCES lopmonhoc(lopmh_id),
  ph_id INT NOT NULL REFERENCES phonghoc(ph_id)
);
