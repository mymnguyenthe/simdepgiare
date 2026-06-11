-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sims table
CREATE TABLE IF NOT EXISTS sims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  price INTEGER NOT NULL,
  carrier TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_sold BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sims_carrier ON sims(carrier);
CREATE INDEX IF NOT EXISTS idx_sims_category_id ON sims(category_id);
CREATE INDEX IF NOT EXISTS idx_sims_is_featured ON sims(is_featured);
CREATE INDEX IF NOT EXISTS idx_sims_is_sold ON sims(is_sold);
CREATE INDEX IF NOT EXISTS idx_sims_price ON sims(price);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sims ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to sims"
  ON sims FOR SELECT
  USING (true);

-- Create policies for authenticated users (admin)
CREATE POLICY "Allow authenticated users to manage categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage sims"
  ON sims FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Tứ Quý', 'tu-quy', 'Sim có 4 số cuối giống nhau'),
  ('Ngũ Quý', 'ngu-quy', 'Sim có 5 số cuối giống nhau'),
  ('Lục Quý', 'luc-quy', 'Sim có 6 số cuối giống nhau'),
  ('Tam Hoa', 'tam-hoa', 'Sim có 3 số cuối giống nhau'),
  ('Sim Số Đẹp', 'sim-so-dep', 'Tổng hợp sim số đẹp'),
  ('Sim Giá Rẻ', 'sim-gia-re', 'Sim số đẹp giá rẻ')
ON CONFLICT (slug) DO NOTHING;
