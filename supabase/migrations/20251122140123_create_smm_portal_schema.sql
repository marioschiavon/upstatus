/*
  # SMM Portal Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `balance` (numeric, default 0)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamptz)
    
    - `platforms`
      - `id` (uuid, primary key)
      - `name` (text) - Instagram, TikTok, Facebook, etc.
      - `slug` (text, unique)
      - `icon` (text)
      - `active` (boolean, default true)
      - `order_position` (integer)
      - `created_at` (timestamptz)
    
    - `categories`
      - `id` (uuid, primary key)
      - `platform_id` (uuid, references platforms)
      - `name` (text)
      - `slug` (text)
      - `active` (boolean, default true)
      - `created_at` (timestamptz)
    
    - `services`
      - `id` (uuid, primary key)
      - `category_id` (uuid, references categories)
      - `name` (text)
      - `description` (text)
      - `price_per_1000` (numeric)
      - `min_quantity` (integer)
      - `max_quantity` (integer)
      - `active` (boolean, default true)
      - `created_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `service_id` (uuid, references services)
      - `link` (text)
      - `quantity` (integer)
      - `total_price` (numeric)
      - `status` (text) - pending, processing, completed, cancelled
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can read their own profile and orders
    - Users can create orders
    - Only admins can manage platforms, categories, and services
    - Public can read active platforms, categories, and services
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  balance numeric DEFAULT 0,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL,
  active boolean DEFAULT true,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active platforms"
  ON platforms FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Admins can manage platforms"
  ON platforms FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id uuid REFERENCES platforms(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price_per_1000 numeric NOT NULL,
  min_quantity integer DEFAULT 100,
  max_quantity integer DEFAULT 100000,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id),
  link text NOT NULL,
  quantity integer NOT NULL,
  total_price numeric NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

INSERT INTO platforms (name, slug, icon, order_position) VALUES
  ('Instagram', 'instagram', 'instagram', 1),
  ('TikTok', 'tiktok', 'video', 2),
  ('Facebook', 'facebook', 'facebook', 3),
  ('YouTube', 'youtube', 'youtube', 4),
  ('Twitter', 'twitter', 'twitter', 5),
  ('Twitch', 'twitch', 'twitch', 6)
ON CONFLICT (slug) DO NOTHING;
