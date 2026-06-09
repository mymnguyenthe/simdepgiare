require('dotenv').config({ path: '.env.local' });

console.log(`
=================================================
🔧 HƯỚNG DẪN CHẠY MIGRATION TRONG SUPABASE
=================================================

1. Mở Supabase Dashboard:
   https://supabase.com/dashboard/project/psaahyftdhlvuhzmbjit/sql-editor

2. Copy toàn bộ SQL bên dưới và paste vào SQL Editor

3. Click "Run" (hoặc Ctrl+Enter)

4. Chạy xong, quay lại terminal và chạy: node scripts/seed-database.js

=================================================
📋 SQL MIGRATION:
=================================================
`);

const fs = require('fs');
const sql = fs.readFileSync('supabase/migrations/002_create_simdepgiare_tables.sql', 'utf-8');
console.log(sql);

console.log(`
=================================================
✅ Sau khi chạy SQL xong, chạy lệnh:
   node scripts/seed-database.js
=================================================
`);
