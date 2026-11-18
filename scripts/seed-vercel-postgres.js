// Script to migrate and seed Vercel Postgres / Neon database
// Run: node scripts/seed-vercel-postgres.js

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  console.error(`
❌ Lỗi: Không tìm thấy biến môi trường kết nối database!
Vui lòng thiết lập POSTGRES_URL hoặc DATABASE_URL trong .env.local hoặc Vercel environment variables.
Ví dụ:
POSTGRES_URL="postgres://default:xxx@ep-xxx.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require"
`);
  process.exit(1);
}

const sql = neon(connectionString);

async function runSeed() {
  console.log('🚀 Bắt đầu khởi tạo và seed dữ liệu vào Vercel Postgres / Neon...');

  try {
    // 1. Đọc file migration 002 từ thư mục supabase
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '002_create_simdepgiare_tables.sql');
    const rawSql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📦 Đang tạo cấu trúc bảng categories & sims...');
    
    // Tách các câu lệnh theo dấu chấm phẩy và loại bỏ comment
    // Hoặc chạy từng khối
    // Tạo bảng categories
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        icon VARCHAR(50),
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('  ✅ Bảng categories đã sẵn sàng.');

    // Tạo bảng sims
    await sql`
      CREATE TABLE IF NOT EXISTS sims (
        id TEXT PRIMARY KEY,
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        price INTEGER NOT NULL,
        carrier VARCHAR(50) NOT NULL,
        category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
        description TEXT,
        feng_shui TEXT,
        is_sold BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('  ✅ Bảng sims đã sẵn sàng.');

    // Tạo bảng orders
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        address TEXT,
        sim_id TEXT REFERENCES sims(id) ON DELETE SET NULL,
        total INTEGER NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('  ✅ Bảng orders đã sẵn sàng.');

    // Tạo các index
    await sql`CREATE INDEX IF NOT EXISTS idx_sims_carrier ON sims(carrier);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sims_category_id ON sims(category_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sims_price ON sims(price);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sims_is_sold ON sims(is_sold);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sims_is_featured ON sims(is_featured);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sims_phone_number ON sims(phone_number);`;
    console.log('  ✅ Đã tạo các indexes tối ưu tìm kiếm.');

    // 2. Seed 12 categories
    console.log('🌱 Đang chèn 12 danh mục sim...');
    const categories = [
      ['1', 'Sim Tứ Quý', 'sim-tu-quy', '👑', 'Sim chứa 4 số giống nhau liên tiếp', 1],
      ['2', 'Sim Ngũ Quý', 'sim-ngu-quy', '🏆', 'Sim chứa 5 số giống nhau liên tiếp', 2],
      ['3', 'Sim Tam Hoa', 'sim-tam-hoa', '💎', 'Sim có 3 số giống nhau ở giữa', 3],
      ['4', 'Sim Lộc Phát', 'sim-loc-phat', '🍀', 'Sim chứa cặp 68, 86 — lộc phát', 4],
      ['5', 'Sim Thần Tài', 'sim-than-tai', '🏛️', 'Sim chứa cặp 39, 79 — thần tài', 5],
      ['6', 'Sim Ông Địa', 'sim-ong-dia', '🌍', 'Sim chứa cặp 38, 78 — ông địa', 6],
      ['7', 'Sim Năm Sinh', 'sim-nam-sinh', '🎂', 'Sim chứa năm sinh của bạn', 7],
      ['8', 'Sim Gánh Đảo', 'sim-ganh-dao', '🔄', 'Sim có dạng gánh đảo đối xứng', 8],
      ['9', 'Sim Lặp', 'sim-lap', '🔁', 'Sim có các cặp số lặp lại', 9],
      ['10', 'Sim Tiến Lên', 'sim-tien-len', '📈', 'Sim có các số tăng dần', 10],
      ['11', 'Sim Lục Quý', 'sim-luc-quy', '💰', 'Sim chứa 6 số giống nhau liên tiếp', 11],
      ['12', 'Sim Giá Rẻ', 'sim-gia-re', '💸', 'Sim số đẹp giá dưới 1 triệu', 12],
    ];

    for (const cat of categories) {
      await sql`
        INSERT INTO categories (id, name, slug, icon, description, sort_order)
        VALUES (${cat[0]}, ${cat[1]}, ${cat[2]}, ${cat[3]}, ${cat[4]}, ${cat[5]})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          icon = EXCLUDED.icon,
          description = EXCLUDED.description,
          sort_order = EXCLUDED.sort_order;
      `;
    }
    console.log('  ✅ Đã chèn/cập nhật 12 danh mục.');

    // 3. Seed 28 sims
    console.log('🌱 Đang chèn 28 sim mẫu...');
    const sims = [
      ['1', '0989999999', 150000000, 'viettel', '2', 'Ngũ quý 9 — sim ngũ quý đỉnh cao đầu số 098 Viettel', 'Bộ năm số 9 — cửu ngũ chí tôn, quyền lực tối thượng', false, true],
      ['2', '0918888888', 135000000, 'vinaphone', '2', 'Ngũ quý 8 — sim ngũ quý phát lộc đầu số 091 VinaPhone', 'Bộ năm số 8 — phát triển bền vững, thịnh vượng lâu dài', false, true],
      ['3', '0906666666', 125000000, 'mobifone', '2', 'Ngũ quý 6 — sim ngũ quý lộc phát đầu số 090 MobiFone', 'Bộ năm số 6 — ngũ lộc tràn đầy', false, true],
      ['4', '0888888888', 120000000, 'vinaphone', '1', 'Tứ quý 8 — sim tứ quý phát lộc đầu số 088 VinaPhone', 'Bộ tứ số 8 — phát tài phát lộc, thịnh vượng', false, true],
      ['5', '0799999999', 110000000, 'mobifone', '1', 'Tứ quý 9 — sim tứ quý cửu cửu đầu số 079 MobiFone', 'Bộ tứ số 9 — trường cửu, vĩnh cửu', false, false],
      ['6', '0966666666', 95000000, 'viettel', '1', 'Tứ quý 6 — sim tứ quý lộc phát đầu số 096 Viettel', 'Bộ tứ số 6 — lộc trời ban, tài lộc viên mãn', false, true],
      ['7', '0977777777', 85000000, 'viettel', '1', 'Tứ quý 7 — sim tứ quý đầu số 097 Viettel', 'Bộ tứ số 7 — sức mạnh thần bí, quyền lực', false, true],
      ['8', '0935555555', 70000000, 'mobifone', '1', 'Tứ quý 5 — sim tứ quý đầu số 093 MobiFone', 'Bộ tứ số 5 — trung tâm, ngũ hành', false, false],
      ['9', '0944444444', 62000000, 'vinaphone', '1', 'Tứ quý 4 — sim tứ quý đầu số 094 VinaPhone', 'Bộ tứ số 4 — ổn định, vững chãi', false, false],
      ['10', '0912222222', 55000000, 'vinaphone', '1', 'Tứ quý 2 — sim tứ quý đầu số 091 VinaPhone', 'Bộ tứ số 2 tượng trưng cho sự cân bằng, đôi lứa', false, true],
      ['11', '0903333333', 48000000, 'mobifone', '1', 'Tứ quý 3 — sim tứ quý đầu số 090 MobiFone', 'Bộ tứ số 3 tượng trưng cho tài năng, sáng tạo', false, false],
      ['12', '0988881111', 45000000, 'viettel', '1', 'Tứ quý 1 — sim tứ quý đầu số 098 Viettel', 'Bộ tứ số 1 tượng trưng cho sự khởi đầu, độc nhất vô nhị', false, false],
      ['13', '0968686868', 35000000, 'viettel', '4', 'Sim lộc phát 686868 — đầu 096 Viettel', 'Lộc phát lặp 3 lần — tài lộc nhân ba', false, false],
      ['14', '0918686868', 28000000, 'vinaphone', '4', 'Sim lộc phát 868686 — đầu 091 VinaPhone', 'Lộc phát đảo 86 — phát lộc liên tục', false, false],
      ['15', '0906868686', 25000000, 'mobifone', '4', 'Sim lộc phát 686868 — đầu 090 MobiFone', 'Lộc phát giữa sim — tài lộc trung tâm', false, false],
      ['16', '0917979797', 15000000, 'vinaphone', '5', 'Sim thần tài 797979 — đầu 091 VinaPhone', 'Thần tài lớn lặp 3 lần — tài lộc lớn', false, false],
      ['17', '0983939393', 12000000, 'viettel', '5', 'Sim thần tài 393939 — đầu 098 Viettel', 'Thần tài nhỏ lặp 3 lần — may mắn liên tục', false, false],
      ['18', '0961234567', 12000000, 'viettel', '10', 'Sim tiến lên 1234567 — đầu 096 Viettel', 'Tiến lên liên tiếp — thăng tiến không ngừng', false, false],
      ['19', '0978889999', 11000000, 'viettel', '3', 'Tam hoa 888 — đầu 097 Viettel', 'Bộ ba số 8 — tam phát', false, false],
      ['20', '0906667890', 9500000, 'mobifone', '3', 'Tam hoa 666 — đầu 090 MobiFone', 'Bộ ba số 6 — tam lộc', false, false],
      ['21', '0917878787', 10000000, 'vinaphone', '6', 'Sim ông địa 787878 — đầu 091 VinaPhone', 'Ông địa lớn — phù trợ đất đai', false, false],
      ['22', '0961555123', 8500000, 'viettel', '3', 'Tam hoa 555 — đầu 096 Viettel', 'Bộ ba số 5 — trung tâm, cân bằng', false, false],
      ['23', '0983838383', 8000000, 'viettel', '6', 'Sim ông địa 383838 — đầu 098 Viettel', 'Ông địa nhỏ — đất đai vững chắc', false, false],
      ['24', '0912333456', 7000000, 'vinaphone', '3', 'Tam hoa 333 — đầu 091 VinaPhone', 'Bộ ba số 3 — tài năng, sáng tạo', false, false],
      ['25', '0321234567', 350000, 'viettel', '12', 'Sim giá rẻ đầu 032 Viettel', 'Sim số đẹp giá tốt', false, false],
      ['26', '0331234567', 450000, 'viettel', '12', 'Sim giá rẻ đầu 033 Viettel', 'Sim dễ nhớ giá tốt', false, false],
      ['27', '0811234567', 400000, 'vinaphone', '12', 'Sim giá rẻ đầu 081 VinaPhone', 'Sim giá tốt VinaPhone', false, false],
      ['28', '0701234567', 400000, 'mobifone', '12', 'Sim giá rẻ đầu 070 MobiFone', 'Sim giá tốt MobiFone', false, false],
    ];

    for (const sim of sims) {
      await sql`
        INSERT INTO sims (id, phone_number, price, carrier, category_id, description, feng_shui, is_sold, is_featured)
        VALUES (
          ${sim[0]},
          ${sim[1]},
          ${sim[2]},
          ${sim[3]},
          ${sim[4]},
          ${sim[5]},
          ${sim[6]},
          ${sim[7]},
          ${sim[8]}
        )
        ON CONFLICT (phone_number) DO UPDATE SET
          price = EXCLUDED.price,
          carrier = EXCLUDED.carrier,
          category_id = EXCLUDED.category_id,
          description = EXCLUDED.description,
          feng_shui = EXCLUDED.feng_shui,
          is_sold = EXCLUDED.is_sold,
          is_featured = EXCLUDED.is_featured;
      `;
    }
    console.log('  ✅ Đã chèn/cập nhật 28 sim thành công.');

    const countCategories = await sql`SELECT COUNT(*)::int as count FROM categories;`;
    const countSims = await sql`SELECT COUNT(*)::int as count FROM sims;`;

    console.log(`
🎉🎉🎉 THÀNH CÔNG!
- Tổng số categories: ${countCategories[0].count}
- Tổng số sims: ${countSims[0].count}
- Database Vercel Postgres / Neon đã sẵn sàng hoạt động!
`);
  } catch (error) {
    console.error('❌ Lỗi khi seeding database:', error);
    process.exit(1);
  }
}

runSeed();
