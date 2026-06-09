const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Phân loại sim dựa trên patterns
function classifySim(phone, price) {
  // Giá rẻ
  if (price < 1000000) {
    return '12'; // Sim Giá Rẻ
  }

  // Lục quý: 6 số giống nhau liên tiếp
  if (/(.)\1{5}/.test(phone)) {
    return '11'; // Sim Lục Quý
  }

  // Ngũ quý: 5 số giống nhau liên tiếp
  if (/(.)\1{4}/.test(phone)) {
    return '2'; // Sim Ngũ Quý
  }

  // Tứ quý: 4 số giống nhau liên tiếp
  if (/(.)\1{3}/.test(phone)) {
    return '1'; // Sim Tứ Quý
  }

  // Tam hoa: 3 số giống nhau ở giữa
  if (/\d{3}(\d)\1{2}\d{3}/.test(phone)) {
    return '3'; // Sim Tam Hoa
  }

  // Tiến lên: 123456, 234567, 345678, 456789, 567890
  if (/123456|234567|345678|456789|567890|012345|678901/.test(phone)) {
    return '10'; // Sim Tiến Lên
  }

  // Gánh đảo: palindrome (ví dụ: 123321, 456654)
  const last6 = phone.slice(-6);
  if (last6 === last6.split('').reverse().join('')) {
    return '8'; // Sim Gánh Đảo
  }

  // Sim lặp: các cặp số lặp lại (ví dụ: 121212, 343434)
  if (/(..)\1{2}/.test(phone) || /(...)\1/.test(phone)) {
    return '9'; // Sim Lặp
  }

  // Lộc phát: chứa 68, 86
  if (/68|86/.test(phone)) {
    return '4'; // Sim Lộc Phát
  }

  // Thần tài: chứa 39, 79
  if (/39|79/.test(phone)) {
    return '5'; // Sim Thần Tài
  }

  // Ông địa: chứa 38, 78
  if (/38|78/.test(phone)) {
    return '6'; // Sim Ông Địa
  }

  // Năm sinh: chứa 19xx hoặc 20xx
  if (/19\d{2}|20\d{2}/.test(phone)) {
    return '7'; // Sim Năm Sinh
  }

  return null; // Không phân loại được
}

async function classifyAllSims() {
  console.log('🚀 Bắt đầu phân loại sim...\n');

  // 1. Fetch tất cả sim (pagination để lấy hết 5663 sim)
  console.log('📖 Fetching tất cả sim từ database...');
  const allSims = [];
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from('sims')
      .select('id, phone_number, price, category_id')
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('❌ Lỗi khi fetch sim:', error);
      return;
    }

    if (!data || data.length === 0) break;
    allSims.push(...data);
    offset += pageSize;

    if (data.length < pageSize) break;
  }

  console.log(`✅ Fetch được ${allSims.length} sim\n`);

  // 2. Phân loại
  console.log('🔍 Phân loại sim...');
  const updates = [];
  const stats = {
    '1': 0,  // Tứ Quý
    '2': 0,  // Ngũ Quý
    '3': 0,  // Tam Hoa
    '4': 0,  // Lộc Phát
    '5': 0,  // Thần Tài
    '6': 0,  // Ông Địa
    '7': 0,  // Năm Sinh
    '8': 0,  // Gánh Đảo
    '9': 0,  // Lặp
    '10': 0, // Tiến Lên
    '11': 0, // Lục Quý
    '12': 0, // Giá Rẻ
    null: 0, // Không phân loại
  };

  for (const sim of allSims) {
    const categoryId = classifySim(sim.phone_number, sim.price);
    stats[categoryId]++;

    if (categoryId !== null && sim.category_id !== categoryId) {
      updates.push({
        id: sim.id,
        category_id: categoryId,
      });
    }
  }

  console.log(`✅ Phân loại xong ${allSims.length} sim\n`);

  // 3. Thống kê
  console.log('📊 Thống kê phân loại:');
  const categoryNames = {
    '1': 'Tứ Quý',
    '2': 'Ngũ Quý',
    '3': 'Tam Hoa',
    '4': 'Lộc Phát',
    '5': 'Thần Tài',
    '6': 'Ông Địa',
    '7': 'Năm Sinh',
    '8': 'Gánh Đảo',
    '9': 'Lặp',
    '10': 'Tiến Lên',
    '11': 'Lục Quý',
    '12': 'Giá Rẻ',
    null: 'Chưa phân loại',
  };

  for (const [catId, count] of Object.entries(stats).sort((a, b) => b[1] - a[1])) {
    if (count > 0) {
      console.log(`  ${categoryNames[catId]}: ${count} sim`);
    }
  }
  console.log();

  // 4. Update database
  if (updates.length === 0) {
    console.log('✅ Tất cả sim đã được phân loại đúng, không cần update!');
    return;
  }

  console.log(`📝 Updating ${updates.length} sim...`);
  const batchSize = 100;
  let updated = 0;

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);

    // Update từng sim một (Supabase không có bulk update với different values)
    for (const update of batch) {
      const { error: updateError } = await supabase
        .from('sims')
        .update({ category_id: update.category_id })
        .eq('id', update.id);

      if (updateError) {
        console.error(`❌ Lỗi khi update sim ${update.id}:`, updateError);
        continue;
      }
    }

    updated += batch.length;
    console.log(`  ✓ Đã update ${updated}/${updates.length} sim`);
  }

  console.log('\n🎉 Phân loại hoàn tất!');
}

classifyAllSims().catch(console.error);
