import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Prefer env-based config (avoids URL-encoding issues for passwords like "jenifer@1")
const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "nursery",
  password: process.env.PGPASSWORD, // set in .env
  port: Number(process.env.PGPORT || 5432),
});

// Health check
app.get("/health", async (_req, res) => {
  try {
    const r = await pool.query("SELECT NOW()");
    res.json({ ok: true, time: r.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "db connection failed" });
  }
});

// Helpers
// Top-level imports and config
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Optional auth parser (does not require auth for all routes; just attaches userId if token is present)
function attachAuth(req, _res, next) {
  try {
    const h = req.headers.authorization || "";
    const m = h.match(/^Bearer\s+(.+)$/i);
    if (m) {
      const payload = jwt.verify(m[1], JWT_SECRET);
      req.userId = payload.userId;
    }
  } catch {}
  next();
}
app.use(attachAuth);

// Helper: user cart
async function getOrCreateCartForUser(userId) {
  const found = await pool.query(
    "SELECT id FROM carts WHERE user_id = $1 AND status = 'open' LIMIT 1",
    [userId]
  );
  if (found.rows[0]) return found.rows[0].id;
  const ins = await pool.query(
    "INSERT INTO carts (user_id, status) VALUES ($1, 'open') RETURNING id",
    [userId]
  );
  return ins.rows[0].id;
}

// Helper: session cart (existing)
async function getOrCreateCart(sessionId = "anon") {
  const found = await pool.query(
    "SELECT id FROM carts WHERE session_id = $1 LIMIT 1",
    [sessionId]
  );
  if (found.rows[0]) return found.rows[0].id;
  const ins = await pool.query(
    "INSERT INTO carts (session_id) VALUES ($1) RETURNING id",
    [sessionId]
  );
  return ins.rows[0].id;
}

// Merge anonymous session cart into the user’s cart on login
async function mergeSessionCartIntoUserCart(sessionId, userId) {
  if (!sessionId || !userId) return;
  const sess = await pool.query(
    "SELECT id FROM carts WHERE session_id = $1 AND status = 'open' LIMIT 1",
    [sessionId]
  );
  if (!sess.rows[0]) return;
  const userCartId = await getOrCreateCartForUser(userId);
  const sessionCartId = sess.rows[0].id;

  const items = await pool.query(
    `SELECT product_id, variant_id, quantity, price_cents
     FROM cart_items WHERE cart_id = $1`,
    [sessionCartId]
  );
  for (const it of items.rows) {
    await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, price_cents)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (cart_id, product_id, variant_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [userCartId, it.product_id, it.variant_id, it.quantity, it.price_cents]
    );
  }
  await pool.query("UPDATE carts SET status = 'abandoned' WHERE id = $1", [sessionCartId]);
}

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "username and password required" });

    const exists = await pool.query("SELECT 1 FROM users WHERE username = $1", [username]);
    if (exists.rowCount) return res.status(409).json({ error: "username already taken" });

    const hash = await bcrypt.hash(password, 12);
    const r = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, hash]
    );
    res.status(201).json({ user: r.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "registration failed" });
  }
});

// Login + merge session cart
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password, sessionId } = req.body;
    if (!username || !password) return res.status(400).json({ error: "username and password required" });

    const r = await pool.query("SELECT id, password_hash FROM users WHERE username = $1", [username]);
    if (!r.rows[0]) return res.status(401).json({ error: "invalid credentials" });

    const ok = await bcrypt.compare(password, r.rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const userId = r.rows[0].id;
    if (sessionId) await mergeSessionCartIntoUserCart(sessionId, userId);

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: userId, username } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "login failed" });
  }
});

// GET /api/cart — prefer user cart if logged in
app.get("/api/cart", async (req, res) => {
  try {
    const cartId = req.userId
      ? await getOrCreateCartForUser(req.userId)
      : await getOrCreateCart(req.query.sessionId || "anon");

    const { rows } = await pool.query(
      `SELECT ci.id, ci.quantity, ci.price_cents,
              p.id AS product_id, p.name, p.image_url
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = $1
       ORDER BY ci.id`,
      [cartId]
    );
    const subtotalCents = rows.reduce((s, r) => s + r.price_cents * r.quantity, 0);
    res.json({ items: rows, subtotalCents });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load cart" });
  }
});

// POST /api/cart/items — prefer user cart if logged in
app.post("/api/cart/items", async (req, res) => {
  try {
    const {
      sessionId = "anon",
      productId: pid,
      productName,
      name,
      variantId,
      qty,
      quantity,
      price_cents,
      image_url, // NEW: allow client to provide image
    } = req.body;

    const desiredQty = Math.max(1, Number(quantity ?? qty ?? 1));

    let productId = null;
    const nm = productName || name || null;

    if (pid && isUUID(pid)) {
      productId = pid;
    } else if (nm) {
      const lookup = await pool.query(
        "SELECT id, image_url FROM products WHERE lower(name) = lower($1) LIMIT 1",
        [nm]
      );
      if (lookup.rows[0]) {
        productId = lookup.rows[0].id;
        // If existing product has no image and client provided one, fill it
        if (!lookup.rows[0].image_url && image_url) {
          await pool.query("UPDATE products SET image_url = $1 WHERE id = $2", [image_url, productId]);
        }
      } else if (Number.isInteger(price_cents) && price_cents >= 0) {
        const ins = await pool.query(
          "INSERT INTO products (name, price_cents, image_url, active) VALUES ($1, $2, $3, TRUE) RETURNING id",
          [nm, price_cents, image_url || null]
        );
        productId = ins.rows[0].id;
      }
    }
    if (!productId) {
      return res.status(400).json({ error: "Valid productId (UUID) or product name required" });
    }

    // Resolve variantId only if valid UUID
    let variant = null;
    if (variantId != null) {
      if (!isUUID(variantId)) {
        return res.status(400).json({ error: "Invalid variantId format" });
      }
      variant = variantId;
    }

    const cartId = req.userId
      ? await getOrCreateCartForUser(req.userId)
      : await getOrCreateCart(sessionId);

    // validate product/variant
    const prodExists = await pool.query("SELECT 1 FROM products WHERE id = $1", [productId]);
    if (prodExists.rowCount === 0) return res.status(400).json({ error: "Invalid productId" });

    if (variant) {
      const varExists = await pool.query(
        "SELECT 1 FROM product_variants WHERE id = $1 AND product_id = $2",
        [variant, productId]
      );
      if (varExists.rowCount === 0) return res.status(400).json({ error: "Invalid variantId for given productId" });
    }

    // snapshot price
    const priceRow = await pool.query(
      variant
        ? "SELECT price_cents FROM product_variants WHERE id = $1"
        : "SELECT price_cents FROM products WHERE id = $1",
      [variant || productId]
    );
    const final_price_cents =
      priceRow.rows[0]?.price_cents ?? (Number.isInteger(price_cents) ? price_cents : 0);

    // upsert identical items
    const existing = await pool.query(
      `SELECT id, quantity FROM cart_items
       WHERE cart_id = $1 AND product_id = $2 AND (variant_id IS NOT DISTINCT FROM $3)`,
      [cartId, productId, variant]
    );
    if (existing.rows[0]) {
      const id = existing.rows[0].id;
      const nextQty = Math.max(1, existing.rows[0].quantity + desiredQty);
      await pool.query("UPDATE cart_items SET quantity = $1 WHERE id = $2", [nextQty, id]);
    } else {
      await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, price_cents)
         VALUES ($1, $2, $3, $4, $5)`,
        [cartId, productId, variant, desiredQty, final_price_cents]
      );
    }

    const { rows } = await pool.query(
      `SELECT ci.id, ci.quantity, ci.price_cents,
              p.id AS product_id, p.name, p.image_url
       FROM cart_items ci JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = $1 ORDER BY ci.id`,
      [cartId]
    );
    res.status(201).json({ items: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// Update qty
// PATCH /api/cart/items/:id
app.patch("/api/cart/items/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const qty = Math.max(1, Number(req.body.quantity ?? req.body.qty));
    await pool.query("UPDATE cart_items SET quantity = $1 WHERE id = $2", [qty, id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// Remove item
app.delete("/api/cart/items/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM cart_items WHERE id = $1", [id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUUID(v) {
  return typeof v === "string" && UUID_RE.test(v);
}