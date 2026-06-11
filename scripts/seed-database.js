// Seed database with sample data
// Run: node scripts/seed-database.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sampleSims = [
  { phone_number: '0987654321', price: 50000000, carrier: 'viettel', category_slug: 'ngu-quy', description: 'Sim ngũ quý 1', is_featured: true },
  { phone_number: '0912345678', price: 30000000, carrier: 'vinaphone', category_slug: 'tu-quy', description: 'Sim tứ quý đẹp', is_featured: true },
  { phone_number: '0909888777', price: 25000000, carrier: 'mobifone', category_slug: 'tam-hoa', description: 'Sim tam hoa', is_featured: false },
  { phone_number: '0938765432', price: 15000000, carrier: 'viettel', category_slug: 'sim-so-dep', description: 'Sim số đẹp giá tốt', is_featured: false },
  { phone_number: '0977123456', price: 8000000, carrier: 'vinaphone', category_slug: 'sim-gia-re', description: 'Sim giá rẻ chất lượng', is_featured: false },
];

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  // Get category IDs
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug');

  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  // Insert sims
  for (const sim of sampleSims) {
    const { data, error } = await supabase
      .from('sims')
      .upsert({
        phone_number: sim.phone_number,
        price: sim.price,
        carrier: sim.carrier,
        category_id: categoryMap[sim.category_slug],
        description: sim.description,
        is_featured: sim.is_featured,
      })
      .select();

    if (error) {
      console.error(`❌ Error inserting ${sim.phone_number}:`, error.message);
    } else {
      console.log(`✅ Inserted ${sim.phone_number}`);
    }
  }

  console.log('🎉 Database seeded successfully!');
}

seedDatabase().catch(console.error);
