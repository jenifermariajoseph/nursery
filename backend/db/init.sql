-- Recreate core schema and seed demo data for local testing
-- Safe to run multiple times; uses IF NOT EXISTS and upserts.

BEGIN;

-- UUID support
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users for auth (JWT backend will use this)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products catalog
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product variants (size/color/etc.)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  name TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Carts (either bound to user_id or anonymous via session_id)
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cart items (snapshot price stored at time of add)
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cart_id, product_id, variant_id)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_variant ON cart_items(product_id, variant_id);

-- Trigger to keep carts.updated_at fresh
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'carts_set_updated_at'
  ) THEN
    CREATE TRIGGER carts_set_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

-- Seed: demo product + variant + anonymous cart with an item
-- Idempotent: will not duplicate on re-runs.

WITH ensure_product AS (
  INSERT INTO products (name, description, price_cents, image_url)
  SELECT 'Ficus Lyrata', 'Lush fiddle leaf fig houseplant', 3999,
         'https://images.example.com/ficus-lyrata.jpg'
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ficus Lyrata')
  RETURNING id, price_cents
),
p AS (
  -- Resolve product to a single row whether it was newly inserted or already present
  SELECT id, price_cents FROM ensure_product
  UNION ALL
  SELECT id, price_cents FROM products WHERE name = 'Ficus Lyrata'
  LIMIT 1
),
v AS (
  -- Create or update the demo variant
  INSERT INTO product_variants (product_id, sku, name, price_cents, stock)
  SELECT p.id, 'FICUS-6IN', '6-inch pot', 4999, 100
  FROM p
  ON CONFLICT (sku) DO UPDATE
    SET product_id = EXCLUDED.product_id,
        name = EXCLUDED.name,
        price_cents = EXCLUDED.price_cents
  RETURNING id, price_cents, product_id
),
c AS (
  -- Create or get the demo anonymous cart
  INSERT INTO carts (session_id, status)
  VALUES ('demo-session', 'open')
  ON CONFLICT (session_id) DO UPDATE
    SET updated_at = now()
  RETURNING id
)
-- Add or bump the cart item quantity
INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, price_cents)
SELECT c.id, v.product_id, v.id, 2, v.price_cents
FROM c, v
ON CONFLICT (cart_id, product_id, variant_id) DO UPDATE
SET quantity = cart_items.quantity + EXCLUDED.quantity;

COMMIT;