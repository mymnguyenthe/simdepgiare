const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedDatabase() {
  console.log('🚀 Bắt đầu seed database...\n');

  // 1. Drop bảng sims cũ
  console.log('📦 Drop bảng sims cũ...');
  const { error: dropError } = await supabase.rpc('exec_sql', {
    sql: 'DROP TABLE IF EXISTS sims CASCADE;'
  });

  // Bỏ qua lỗi nếu hàm exec_sql không tồn tại, sẽ dùng cách khác
  if (dropError && !dropError.message.includes('Could not find')) {
    console.log('⚠️  Không thể drop qua RPC, sẽ thử cách khác...');
  }

  // 2. Tạo bảng categories
  console.log('📦 Tạo bảng categories...');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .limit(1);

  if (catError && catError.message.includes('does not exist')) {
    console.log('⚠️  Bảng categories chưa tồn tại. Vui lòng chạy SQL trong Supabase Dashboard:');
    console.log('\n📋 Copy nội dung file: supabase/migrations/002_create_simdepgiare_tables.sql');
    console.log('📋 Vào Supabase Dashboard → SQL Editor → New Query → Paste và Run\n');
    return;
  }

  // 3. Insert categories
  console.log('📝 Insert 12 categories...');
  const categoriesData = [
    { id: '1', name: 'Sim Tứ Quý', slug: 'sim-tu-quy', icon: '👑', description: 'Sim chứa 4 số giống nhau liên tiếp', sort_order: 1 },
    { id: '2', name: 'Sim Ngũ Quý', slug: 'sim-ngu-quy', icon: '🏆', description: 'Sim chứa 5 số giống nhau liên tiếp', sort_order: 2 },
    { id: '3', name: 'Sim Tam Hoa', slug: 'sim-tam-hoa', icon: '💎', description: 'Sim có 3 số giống nhau ở giữa', sort_order: 3 },
    { id: '4', name: 'Sim Lộc Phát', slug: 'sim-loc-phat', icon: '🍀', description: 'Sim chứa cặp 68, 86 — lộc phát', sort_order: 4 },
    { id: '5', name: 'Sim Thần Tài', slug: 'sim-than-tai', icon: '🏛️', description: 'Sim chứa cặp 39, 79 — thần tài', sort_order: 5 },
    { id: '6', name: 'Sim Ông Địa', slug: 'sim-ong-dia', icon: '🌍', description: 'Sim chứa cặp 38, 78 — ông địa', sort_order: 6 },
    { id: '7', name: 'Sim Năm Sinh', slug: 'sim-nam-sinh', icon: '🎂', description: 'Sim chứa năm sinh của bạn', sort_order: 7 },
    { id: '8', name: 'Sim Gánh Đảo', slug: 'sim-ganh-dao', icon: '🔄', description: 'Sim có dạng gánh đảo đối xứng', sort_order: 8 },
    { id: '9', name: 'Sim Lặp', slug: 'sim-lap', icon: '🔁', description: 'Sim có các cặp số lặp lại', sort_order: 9 },
    { id: '10', name: 'Sim Tiến Lên', slug: 'sim-tien-len', icon: '📈', description: 'Sim có các số tăng dần', sort_order: 10 },
    { id: '11', name: 'Sim Lục Quý', slug: 'sim-luc-quy', icon: '💰', description: 'Sim chứa 6 số giống nhau liên tiếp', sort_order: 11 },
    { id: '12', name: 'Sim Giá Rẻ', slug: 'sim-gia-re', icon: '💸', description: 'Sim số đẹp giá dưới 1 triệu', sort_order: 12 },
  ];

  const { error: insertCatError } = await supabase
    .from('categories')
    .upsert(categoriesData, { onConflict: 'id' });

  if (insertCatError) {
    console.error('❌ Lỗi khi insert categories:', insertCatError);
    return;
  }
  console.log('✅ Insert 12 categories thành công!\n');

  // 4. Insert sims
  console.log('📝 Insert 28 sims...');
  const simsData = [
    { id: '1', phone_number: '0989999999', price: 150000000, carrier: 'viettel', category_id: '2', description: 'Ngũ quý 9 — sim ngũ quý đỉnh cao đầu số 098 Viettel', feng_shui: 'Bộ năm số 9 — cửu ngũ chí tôn, quyền lực tối thượng', is_sold: false, is_featured: true },
    { id: '2', phone_number: '0918888888', price: 135000000, carrier: 'vinaphone', category_id: '2', description: 'Ngũ quý 8 — sim ngũ quý phát lộc đầu số 091 VinaPhone', feng_shui: 'Bộ năm số 8 — phát triển bền vững, thịnh vượng lâu dài', is_sold: false, is_featured: true },
    { id: '3', phone_number: '0906666666', price: 125000000, carrier: 'mobifone', category_id: '2', description: 'Ngũ quý 6 — sim ngũ quý lộc phát đầu số 090 MobiFone', feng_shui: 'Bộ năm số 6 — ngũ lộc tràn đầy', is_sold: false, is_featured: true },
    { id: '4', phone_number: '0888888888', price: 120000000, carrier: 'vinaphone', category_id: '1', description: 'Tứ quý 8 — sim tứ quý phát lộc đầu số 088 VinaPhone', feng_shui: 'Bộ tứ số 8 — phát tài phát lộc, thịnh vượng', is_sold: false, is_featured: true },
    { id: '5', phone_number: '0799999999', price: 110000000, carrier: 'mobifone', category_id: '1', description: 'Tứ quý 9 — sim tứ quý cửu cửu đầu số 079 MobiFone', feng_shui: 'Bộ tứ số 9 — trường cửu, vĩnh cửu', is_sold: false, is_featured: false },
    { id: '6', phone_number: '0966666666', price: 95000000, carrier: 'viettel', category_id: '1', description: 'Tứ quý 6 — sim tứ quý lộc phát đầu số 096 Viettel', feng_shui: 'Bộ tứ số 6 — lộc trời ban, tài lộc viên mãn', is_sold: false, is_featured: true },
    { id: '7', phone_number: '0977777777', price: 85000000, carrier: 'viettel', category_id: '1', description: 'Tứ quý 7 — sim tứ quý đầu số 097 Viettel', feng_shui: 'Bộ tứ số 7 — sức mạnh thần bí, quyền lực', is_sold: false, is_featured: true },
    { id: '8', phone_number: '0935555555', price: 70000000, carrier: 'mobifone', category_id: '1', description: 'Tứ quý 5 — sim tứ quý đầu số 093 MobiFone', feng_shui: 'Bộ tứ số 5 — trung tâm, ngũ hành', is_sold: false, is_featured: false },
    { id: '9', phone_number: '0944444444', price: 62000000, carrier: 'vinaphone', category_id: '1', description: 'Tứ quý 4 — sim tứ quý đầu số 094 VinaPhone', feng_shui: 'Bộ tứ số 4 — ổn định, vững chãi', is_sold: false, is_featured: false },
    { id: '10', phone_number: '0912222222', price: 55000000, carrier: 'vinaphone', category_id: '1', description: 'Tứ quý 2 — sim tứ quý đầu số 091 VinaPhone', feng_shui: 'Bộ tứ số 2 tượng trưng cho sự cân bằng, đôi lứa', is_sold: false, is_featured: true },
    { id: '11', phone_number: '0903333333', price: 48000000, carrier: 'mobifone', category_id: '1', description: 'Tứ quý 3 — sim tứ quý đầu số 090 MobiFone', feng_shui: 'Bộ tứ số 3 tượng trưng cho tài năng, sáng tạo', is_sold: false, is_featured: false },
    { id: '12', phone_number: '0988881111', price: 45000000, carrier: 'viettel', category_id: '1', description: 'Tứ quý 1 — sim tứ quý đầu số 098 Viettel', feng_shui: 'Bộ tứ số 1 tượng trưng cho sự khởi đầu, độc nhất vô nhị', is_sold: false, is_featured: false },
    { id: '13', phone_number: '0968686868', price: 35000000, carrier: 'viettel', category_id: '4', description: 'Sim lộc phát 686868 — đầu 096 Viettel', feng_shui: 'Lộc phát lặp 3 lần — tài lộc nhân ba', is_sold: false, is_featured: false },
    { id: '14', phone_number: '0918686868', price: 28000000, carrier: 'vinaphone', category_id: '4', description: 'Sim lộc phát 868686 — đầu 091 VinaPhone', feng_shui: 'Lộc phát đảo 86 — phát lộc liên tục', is_sold: false, is_featured: false },
    { id: '15', phone_number: '0906868686', price: 25000000, carrier: 'mobifone', category_id: '4', description: 'Sim lộc phát 686868 — đầu 090 MobiFone', feng_shui: 'Lộc phát giữa sim — tài lộc trung tâm', is_sold: false, is_featured: false },
    { id: '16', phone_number: '0917979797', price: 15000000, carrier: 'vinaphone', category_id: '5', description: 'Sim thần tài 797979 — đầu 091 VinaPhone', feng_shui: 'Thần tài lớn lặp 3 lần — tài lộc lớn', is_sold: false, is_featured: false },
    { id: '17', phone_number: '0983939393', price: 12000000, carrier: 'viettel', category_id: '5', description: 'Sim thần tài 393939 — đầu 098 Viettel', feng_shui: 'Thần tài nhỏ lặp 3 lần — may mắn liên tục', is_sold: false, is_featured: false },
    { id: '18', phone_number: '0961234567', price: 12000000, carrier: 'viettel', category_id: '10', description: 'Sim tiến lên 1234567 — đầu 096 Viettel', feng_shui: 'Tiến lên liên tiếp — thăng tiến không ngừng', is_sold: false, is_featured: false },
    { id: '19', phone_number: '0978889999', price: 11000000, carrier: 'viettel', category_id: '3', description: 'Tam hoa 888 — đầu 097 Viettel', feng_shui: 'Bộ ba số 8 — tam phát', is_sold: false, is_featured: false },
    { id: '20', phone_number: '0906667890', price: 9500000, carrier: 'mobifone', category_id: '3', description: 'Tam hoa 666 — đầu 090 MobiFone', feng_shui: 'Bộ ba số 6 — tam lộc', is_sold: false, is_featured: false },
    { id: '21', phone_number: '0917878787', price: 10000000, carrier: 'vinaphone', category_id: '6', description: 'Sim ông địa 787878 — đầu 091 VinaPhone', feng_shui: 'Ông địa lớn — phù trợ đất đai', is_sold: false, is_featured: false },
    { id: '22', phone_number: '0961555123', price: 8500000, carrier: 'viettel', category_id: '3', description: 'Tam hoa 555 — đầu 096 Viettel', feng_shui: 'Bộ ba số 5 — trung tâm, cân bằng', is_sold: false, is_featured: false },
    { id: '23', phone_number: '0983838383', price: 8000000, carrier: 'viettel', category_id: '6', description: 'Sim ông địa 383838 — đầu 098 Viettel', feng_shui: 'Ông địa nhỏ — đất đai vững chắc', is_sold: false, is_featured: false },
    { id: '24', phone_number: '0912333456', price: 7000000, carrier: 'vinaphone', category_id: '3', description: 'Tam hoa 333 — đầu 091 VinaPhone', feng_shui: 'Bộ ba số 3 — tài năng, sáng tạo', is_sold: false, is_featured: false },
    { id: '25', phone_number: '0321234567', price: 350000, carrier: 'viettel', category_id: '12', description: 'Sim giá rẻ đầu 032 Viettel', feng_shui: 'Sim số đẹp giá tốt', is_sold: false, is_featured: false },
    { id: '26', phone_number: '0331234567', price: 450000, carrier: 'viettel', category_id: '12', description: 'Sim giá rẻ đầu 033 Viettel', feng_shui: 'Sim dễ nhớ giá tốt', is_sold: false, is_featured: false },
    { id: '27', phone_number: '0811234567', price: 400000, carrier: 'vinaphone', category_id: '12', description: 'Sim giá rẻ đầu 081 VinaPhone', feng_shui: 'Sim giá tốt VinaPhone', is_sold: false, is_featured: false },
    { id: '28', phone_number: '0701234567', price: 400000, carrier: 'mobifone', category_id: '12', description: 'Sim giá rẻ đầu 070 MobiFone', feng_shui: 'Sim giá tốt MobiFone', is_sold: false, is_featured: false },
  ];

  const { error: insertSimError } = await supabase
    .from('sims')
    .upsert(simsData, { onConflict: 'id' });

  if (insertSimError) {
    console.error('❌ Lỗi khi insert sims:', insertSimError);
    return;
  }
  console.log('✅ Insert 28 sims thành công!\n');

  console.log('🎉 Seed database hoàn tất!');
}

seedDatabase().catch(console.error);
