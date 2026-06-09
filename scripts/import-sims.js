const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapping đầu số theo nhà mạng
function getCarrier(phone) {
  const prefix = phone.substring(0, 3);
  const viettel = ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'];
  const vinaphone = ['088', '091', '094', '083', '084', '085'];
  const mobifone = ['089', '090', '093', '070', '076', '077', '078', '079', '081'];

  if (viettel.includes(prefix)) return 'viettel';
  if (vinaphone.includes(prefix)) return 'vinaphone';
  if (mobifone.includes(prefix)) return 'mobifone';
  return 'other';
}

// Đọc file và parse data
function parseSimFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = content.trim().split('\n');
  const sims = [];

  // Bỏ qua header (dòng đầu tiên)
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('\t');
    if (parts.length >= 2) {
      const phone = parts[0].trim();
      const price = parseInt(parts[1].trim());

      if (phone && price) {
        sims.push({
          id: `sim_${i}`,
          phone_number: phone,
          price: price,
          carrier: getCarrier(phone),
          is_sold: false,
          is_featured: false,
        });
      }
    }
  }

  return sims;
}

async function importSims() {
  console.log('🚀 Bắt đầu import sim từ file...\n');

  // 1. Đọc file
  console.log('📖 Đọc file sim_gia_upload.txt...');
  const sims = parseSimFile('/Users/mike/Downloads/sim_gia_upload.txt');
  console.log(`✅ Đọc được ${sims.length} sim\n`);

  // 2. Xóa data cũ
  console.log('🗑️  Xóa toàn bộ data cũ trong bảng sims...');
  const { error: deleteError } = await supabase.from('sims').delete().neq('id', '');
  if (deleteError) {
    console.error('❌ Lỗi khi xóa data cũ:', deleteError);
    return;
  }
  console.log('✅ Đã xóa data cũ!\n');

  // 3. Insert data mới (batch 100 records mỗi lần)
  console.log('📝 Insert data mới...');
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < sims.length; i += batchSize) {
    const batch = sims.slice(i, i + batchSize);
    const { error: insertError } = await supabase.from('sims').insert(batch);

    if (insertError) {
      console.error(`❌ Lỗi khi insert batch ${i / batchSize + 1}:`, insertError);
      return;
    }

    inserted += batch.length;
    console.log(`  ✓ Đã insert ${inserted}/${sims.length} sim`);
  }

  console.log('\n🎉 Import hoàn tất!');
  console.log(`📊 Tổng cộng: ${sims.length} sim đã được import`);

  // 4. Thống kê theo nhà mạng
  const viettelCount = sims.filter(s => s.carrier === 'viettel').length;
  const vinaphoneCount = sims.filter(s => s.carrier === 'vinaphone').length;
  const mobifoneCount = sims.filter(s => s.carrier === 'mobifone').length;
  const otherCount = sims.filter(s => s.carrier === 'other').length;

  console.log('\n📈 Thống kê theo nhà mạng:');
  console.log(`  - Viettel: ${viettelCount} sim`);
  console.log(`  - VinaPhone: ${vinaphoneCount} sim`);
  console.log(`  - MobiFone: ${mobifoneCount} sim`);
  if (otherCount > 0) console.log(`  - Khác: ${otherCount} sim`);
}

importSims().catch(console.error);
