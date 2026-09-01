-- ====================================================================
-- BIN ISHAQ PROPERTIES — SUPABASE DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ====================================================================

-- 1. SITE CONTENT (CMS) TABLE
CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY DEFAULT 'current',
  content JSONB,
  company JSONB,
  hero JSONB,
  search_filter JSONB,
  footer JSONB,
  offices JSONB,
  why_choose JSONB,
  about JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Policies for site_content
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on site_content') THEN
    CREATE POLICY "Allow public read on site_content" ON site_content FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on site_content') THEN
    CREATE POLICY "Allow all on site_content" ON site_content FOR ALL USING (true);
  END IF;
END $$;

-- 2. PROPERTIES INVENTORY TABLE
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_urdu TEXT,
  slug TEXT,
  property_type TEXT,
  category TEXT,
  purpose TEXT DEFAULT 'buy',
  price NUMERIC,
  price_display TEXT,
  location JSONB,
  society TEXT,
  city TEXT,
  specs JSONB,
  features TEXT[],
  images TEXT[],
  featured_image TEXT,
  status TEXT DEFAULT 'published',
  is_featured BOOLEAN DEFAULT false,
  is_hot BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  submitted_by JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on properties') THEN
    CREATE POLICY "Allow public read on properties" ON properties FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on properties') THEN
    CREATE POLICY "Allow all on properties" ON properties FOR ALL USING (true);
  END IF;
END $$;

-- 3. CRM LEADS & INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  inquiry_type TEXT DEFAULT 'general',
  budget TEXT,
  message TEXT,
  source TEXT DEFAULT 'Website',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on leads') THEN
    CREATE POLICY "Allow public insert on leads" ON leads FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on leads') THEN
    CREATE POLICY "Allow all on leads" ON leads FOR ALL USING (true);
  END IF;
END $$;

-- 4. APPOINTMENTS & VIEWINGS TABLE
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  property_id TEXT,
  property_title TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  preferred_date TEXT,
  preferred_time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on appointments') THEN
    CREATE POLICY "Allow public insert on appointments" ON appointments FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on appointments') THEN
    CREATE POLICY "Allow all on appointments" ON appointments FOR ALL USING (true);
  END IF;
END $$;

-- 5. SOCIETY MAPS & PLANS TABLE
CREATE TABLE IF NOT EXISTS maps (
  id TEXT PRIMARY KEY,
  society TEXT NOT NULL,
  title TEXT NOT NULL,
  sector TEXT,
  description TEXT,
  pdf_url TEXT NOT NULL,
  image_preview TEXT,
  file_size TEXT,
  resolution TEXT,
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE maps ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on maps') THEN
    CREATE POLICY "Allow public read on maps" ON maps FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on maps') THEN
    CREATE POLICY "Allow all on maps" ON maps FOR ALL USING (true);
  END IF;
END $$;
