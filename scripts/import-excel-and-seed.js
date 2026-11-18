// scripts/import-excel-and-seed.js
// Import Excel sims, auto-classify, backup to local and seed into Vercel Postgres

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const EXCEL_FILE = '/Users/mike/Downloads/BANG SOo 05.11.2025 DAILY 0945556789.xlsx';
const BACKUP_DIR = path.join(__dirname, '..', 'data');
const BACKUP_JSON = path.join(BACKUP_DIR, 'sims_backup.json');
const BACKUP_CSV = path.join(BACKUP_DIR, 'sims_backup.csv');

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  console.error('❌ Lỗi: Không tìm thấy biến môi trường POSTGRES_URL hoặc DATABASE_URL!');
  process.exit(1);
}

const sql = neon(connectionString);

// Mapping tên category
const categoryNames = {
  '1': 'Sim Tứ Quý',
  '2': 'Sim Ngũ Quý',
  '3': 'Sim Tam Hoa',
  '4': 'Sim Lộc Phát',
  '5': 'Sim Thần Tài',
  '6': 'Sim Ông Địa',
  '7': 'Sim Năm Sinh',
  '8': 'Sim Gánh Đảo',
  '9': 'Sim Lặp',
  '10': 'Sim Tiến Lên',
  '11': 'Sim Lục Quý',
  '12': 'Sim Giá Rẻ',
};

// Chuẩn hóa số điện thoại
function cleanPhone(raw) {
  if (raw === null || raw === undefined) return null;
  let s = String(raw).trim().replace(/[^0-9]/g, '');
  if (!s) return null;
  if (s.startsWith('84') && s.length === 11) s = '0' + s.slice(2);
  if (s.length === 9 && ['3', '5', '7', '8', '9'].includes(s[0])) s = '0' + s;
  if (/^0\d{9}$/.test(s)) return s;
  return null;
}

// Chuẩn hóa giá tiền
function cleanPrice(raw) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number' && !isNaN(raw) && raw > 0) return Math.round(raw);
  const s = String(raw).trim().replace(/[^0-9]/g, '');
  const p = parseInt(s, 10);
  return !isNaN(p) && p > 0 ? p : null;
}

// Xác định nhà mạng
function getCarrier(phone, hint) {
  const h = hint ? String(hint).toLowerCase().trim() : '';
  if (h.includes('viettel')) return 'viettel';
  if (h.includes('vinaphone')) return 'vinaphone';
  if (h.includes('mobifone')) return 'mobifone';
  if (h.includes('vietnamobile')) return 'vietnamobile';

  const prefix3 = phone.substring(0, 3);
  const prefix4 = phone.substring(0, 4);

  const viettel = ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'];
  const vinaphone = ['088', '091', '094', '081', '082', '083', '084', '085'];
  const mobifone = ['089', '090', '093', '070', '076', '077', '078', '079'];
  const vietnamobile = ['092', '056', '052', '058'];
  const itelecom = ['087'];
  const wintel = ['055'];

  if (viettel.includes(prefix3)) return 'viettel';
  if (vinaphone.includes(prefix3)) return 'vinaphone';
  if (mobifone.includes(prefix3)) return 'mobifone';
  if (vietnamobile.includes(prefix3)) return 'vietnamobile';
  if (itelecom.includes(prefix3)) return 'itelecom';
  if (wintel.includes(prefix3)) return 'wintel';
  if (prefix3 === '099') return 'mobifone'; // Gmobile / chuyển mạng hoặc theo ghi chú
  return 'vinaphone';
}

// Tự động phân loại sim theo 12 categories
function classifySim(phone, price) {
  const last4 = phone.slice(-4);
  const last6 = phone.slice(-6);

  // 11: Lục Quý (6 số giống nhau)
  if (/(.)\1{5}/.test(phone)) return '11';

  // 2: Ngũ Quý (5 số giống nhau)
  if (/(.)\1{4}/.test(phone)) return '2';

  // 1: Tứ Quý (4 số giống nhau)
  if (/(.)\1{3}/.test(phone)) return '1';

  // 10: Tiến Lên (sảnh tiến đuôi)
  if (
    /123456|234567|345678|456789|567890/.test(phone) ||
    /12345|23456|34567|45678|56789/.test(phone) ||
    /1234$|2345$|3456$|4567$|5678$|6789$|3579$|2468$|678$|789$/.test(phone)
  ) return '10';

  // 3: Tam Hoa (3 số cuối giống nhau hoặc tam hoa kép)
  if (/(.)\1{2}$/.test(phone) || /(.)\1{2}(.)\2{2}/.test(phone) || /\d{3}(\d)\1{2}\d{3}/.test(phone)) return '3';

  // 4: Lộc Phát (đuôi 68, 86, 6868, 8686, 6886)
  if (/68$|86$|6868$|8686$|6886$/.test(phone)) return '4';

  // 5: Thần Tài (đuôi 39, 79, 3979, 7979, 3939)
  if (/39$|79$|3979$|7979$|3939$/.test(phone)) return '5';

  // 6: Ông Địa (đuôi 38, 78, 3878, 7878, 3838)
  if (/38$|78$|3878$|7878$|3838$/.test(phone)) return '6';

  // 8: Gánh Đảo (đối xứng đuôi hoặc aba/abba)
  if (
    last6 === last6.split('').reverse().join('') ||
    last4 === last4.split('').reverse().join('') ||
    (phone.slice(-3) === phone.slice(-3).split('').reverse().join('') && phone[7] !== phone[8])
  ) return '8';

  // 9: Sim Lặp (ví dụ: abab, abcabc ở cuối)
  if (
    /(..)\1$/.test(phone) ||
    /(...)\1$/.test(phone) ||
    /(..)\1{2}$/.test(phone)
  ) return '9';

  // 7: Năm Sinh (1950 - 2025 ở cuối)
  const yr = parseInt(phone.slice(-4), 10);
  if (yr >= 1950 && yr <= 2025) return '7';

  // 12: Sim Giá Rẻ hoặc phổ thông
  if (price <= 1000000) return '12';

  // Nếu chứa cặp số đẹp trong dãy
  if (/68|86/.test(phone)) return '4';
  if (/39|79/.test(phone)) return '5';
  if (/38|78/.test(phone)) return '6';

  return '12';
}

function generateDescription(phone, price, categoryId, carrier) {
  const catName = categoryNames[categoryId] || 'Sim Số Đẹp';
  const carrierUpper = carrier.toUpperCase();
  const last4 = phone.slice(-4);
  return `${catName} đuôi ${last4} — đầu số ${phone.slice(0, 3)} mạng ${carrierUpper}`;
}

function generateFengShui(phone, categoryId) {
  switch (categoryId) {
    case '11':
      return 'Lục quý đỉnh cao, tài lộc vượng khí tối thượng, hanh thông mọi nẻo.';
    case '2':
      return 'Ngũ quý quyền uy, cửu ngũ chí tôn, củng cố vị thế và quyền lực.';
    case '1':
      return 'Tứ quý vững chãi, tứ trụ bình an, phú quý trường tồn.';
    case '10':
      return 'Dãy số tiến liên tục tượng trưng cho thăng quan tiến chức, công danh rực rỡ.';
    case '3':
      return 'Tam hoa may mắn, tam tài hội tụ, phúc lộc song toàn.';
    case '4':
      return 'Lộc phát phát lộc, chiêu tài tụ bảo, kinh doanh phát đạt.';
    case '5':
      return 'Thần tài hộ mệnh, tiền bạc rủng rỉnh, vạn sự hanh thông.';
    case '6':
      return 'Ông địa phù trợ, đất đai hưng vượng, tài sản gia tăng.';
    case '7':
      return 'Sim phong thủy gắn liền năm sinh, khẳng định phong cách và bản lĩnh cá nhân.';
    case '8':
      return 'Thế gánh vững vàng, đảo chiều đón may, trong nguy có cơ.';
    case '9':
      return 'Nhịp điệu cân đối, hài hòa âm dương, thu hút sinh khí.';
    default:
      return 'Dãy số cân bằng âm dương, cát khí hài hòa, phù hợp làm ăn lâu dài.';
  }
}

async function main() {
  console.log('📂 Đang đọc file Excel:', EXCEL_FILE);
  if (!fs.existsSync(EXCEL_FILE)) {
    console.error('❌ Không tìm thấy file:', EXCEL_FILE);
    process.exit(1);
  }

  const wb = XLSX.readFile(EXCEL_FILE);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  console.log(`📊 Tổng số dòng trong Excel: ${rawRows.length}`);

  const sims = [];
  const phoneSet = new Set();
  const categoryCounts = {};
  const carrierCounts = {};

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;

    const phone = cleanPhone(row[0]);
    const price = cleanPrice(row[1]);
    const carrierHint = row[2];

    if (!phone || !price) continue;
    if (phoneSet.has(phone)) continue; // Bỏ trùng lặp nếu có

    phoneSet.add(phone);

    const carrier = getCarrier(phone, carrierHint);
    const categoryId = classifySim(phone, price);
    const isFeatured = price >= 50000000 || categoryId === '11' || categoryId === '2';
    const description = generateDescription(phone, price, categoryId, carrier);
    const fengShui = generateFengShui(phone, categoryId);

    categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
    carrierCounts[carrier] = (carrierCounts[carrier] || 0) + 1;

    sims.push({
      id: `sim_${phone}`,
      phone_number: phone,
      price: price,
      carrier: carrier,
      category_id: categoryId,
      description: description,
      feng_shui: fengShui,
      is_sold: false,
      is_featured: isFeatured,
      image_url: null,
    });
  }

  console.log(`\n✅ Đã trích xuất & chuẩn hóa thành công: ${sims.length} sim.`);

  // 1. Tạo file backup local
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  console.log('\n💾 Đang lưu file backup tại local...');
  fs.writeFileSync(BACKUP_JSON, JSON.stringify(sims, null, 2), 'utf8');
  console.log(`  ✓ Đã lưu file JSON: ${BACKUP_JSON} (${(fs.statSync(BACKUP_JSON).size / 1024 / 1024).toFixed(2)} MB)`);

  // Lưu CSV backup
  const csvHeaders = ['phone_number', 'price', 'carrier', 'category_id', 'category_name', 'is_featured', 'description', 'feng_shui'];
  const csvRows = [csvHeaders.join(',')];
  for (const s of sims) {
    const row = [
      s.phone_number,
      s.price,
      s.carrier,
      s.category_id,
      `"${categoryNames[s.category_id] || ''}"`,
      s.is_featured,
      `"${(s.description || '').replace(/"/g, '""')}"`,
      `"${(s.feng_shui || '').replace(/"/g, '""')}"`,
    ];
    csvRows.push(row.join(','));
  }
  fs.writeFileSync(BACKUP_CSV, csvRows.join('\n'), 'utf8');
  console.log(`  ✓ Đã lưu file CSV: ${BACKUP_CSV} (${(fs.statSync(BACKUP_CSV).size / 1024).toFixed(2)} KB)`);

  // 2. Thống kê phân loại
  console.log('\n📈 Thống kê phân loại theo Danh mục:');
  for (const [catId, count] of Object.entries(categoryCounts).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    console.log(`  - [${catId}] ${categoryNames[catId]}: ${count} sim`);
  }

  console.log('\n📈 Thống kê theo Nhà mạng:');
  for (const [c, count] of Object.entries(carrierCounts)) {
    console.log(`  - ${c.toUpperCase()}: ${count} sim`);
  }

  // 3. Kết nối database và xoá dữ liệu cũ, seed dữ liệu mới
  console.log('\n🗑️  Đang xoá dữ liệu mẫu cũ trong bảng sims...');
  await sql`DELETE FROM sims;`;
  console.log('  ✅ Đã xoá toàn bộ dữ liệu mẫu cũ.');

  console.log(`\n🚀 Đang nạp ${sims.length} sim mới vào Vercel Postgres...`);
  const BATCH_SIZE = 250;
  let inserted = 0;

  for (let i = 0; i < sims.length; i += BATCH_SIZE) {
    const batch = sims.slice(i, i + BATCH_SIZE);

    // Xây dựng câu lệnh multi-values an toàn
    const valueClauses = [];
    const params = [];

    for (let j = 0; j < batch.length; j++) {
      const s = batch[j];
      const offset = j * 9;
      valueClauses.push(
        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9})`
      );
      params.push(
        s.id,
        s.phone_number,
        s.price,
        s.carrier,
        s.category_id,
        s.description,
        s.feng_shui,
        s.is_sold,
        s.is_featured
      );
    }

    const query = `
      INSERT INTO sims (
        id,
        phone_number,
        price,
        carrier,
        category_id,
        description,
        feng_shui,
        is_sold,
        is_featured
      )
      VALUES ${valueClauses.join(',\n')}
      ON CONFLICT (phone_number) DO UPDATE SET
        price = EXCLUDED.price,
        carrier = EXCLUDED.carrier,
        category_id = EXCLUDED.category_id,
        description = EXCLUDED.description,
        feng_shui = EXCLUDED.feng_shui,
        is_sold = EXCLUDED.is_sold,
        is_featured = EXCLUDED.is_featured;
    `;

    await sql.query(query, params);
    inserted += batch.length;
    process.stdout.write(`\r  ✓ Đã nạp: ${inserted}/${sims.length} sim...`);
  }

  console.log('\n\n🔍 Đang kiểm tra lại số lượng trong cơ sở dữ liệu...');
  const countRes = await sql`SELECT COUNT(*)::int as count FROM sims;`;
  console.log(`🎉 THÀNH CÔNG RỰC RỠ!`);
  console.log(`📊 Tổng số sim hiện có trên Vercel Postgres: ${countRes[0].count} sim.`);
}

main().catch((err) => {
  console.error('\n❌ Có lỗi xảy ra trong quá trình thực thi:', err);
  process.exit(1);
});
