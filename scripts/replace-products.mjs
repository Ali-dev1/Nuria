#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config();

// ── Config ───────────────────────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const BATCH_SIZE = 500;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

// ── Helpers ──────────────────────────────────────────────────

async function countProducts() {
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(`Count failed: ${error.message}`);
  return count ?? 0;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);
}

function mapRecord(record, index) {
  const title = record.title || record.name || `Product ${index + 1}`;
  const slug = `${slugify(title)}-${Date.now()}-${index}`;

  return {
    title,
    slug,
    price: record.current_price != null ? Number(record.current_price) : 0,
    description: record.description || null,
    original_url: record.source_url || null,
    image_url: record.image_url || null,
    author: record.author || null,
    isbn: record.isbn || null,
    original_price: record.original_price != null ? Number(record.original_price) : null,
    category: record.category || null,
    stock: record.stock != null ? Number(record.stock) : 10,
    format: record.format || "physical",
    is_featured: false,
    rating: record.rating != null ? Number(record.rating) : null,
    review_count: record.review_count != null ? Number(record.review_count) : 0,
  };
}

async function performTruncate() {
  console.log("🗑️  Truncating products table (CASCADE)…");
  const { error: truncErr } = await supabase.rpc("exec_sql", {
    query: "TRUNCATE public.products CASCADE;",
  });

  if (truncErr) {
    console.warn(`   ⚠ RPC exec_sql not available (${truncErr.message}). Falling back to DELETE.`);
    const { error: delErr } = await supabase
      .from("products")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (delErr) throw new Error(`Delete fallback failed: ${delErr.message}`);
  }
}

async function batchInsert(rows) {
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("products").insert(batch);
    if (error) throw error;
    inserted += batch.length;
    console.log(`   ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1} — ${inserted}/${rows.length} rows inserted`);
  }
  return inserted;
}

// ── Main Execution (Top-Level Await) ─────────────────────────

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error("Usage: node scripts/replace-products.mjs <path-to-json>");
  process.exit(1);
}

try {
  console.log(`\n📂 Reading ${jsonPath}…`);
  const raw = await readFile(resolve(jsonPath), "utf-8");
  const records = JSON.parse(raw);
  console.log(`   Found ${records.length} records in file.\n`);

  const beforeCount = await countProducts();
  console.log(`📊 Products table BEFORE: ${beforeCount} rows\n`);

  await performTruncate();

  const afterTruncate = await countProducts();
  console.log(`   Table now has ${afterTruncate} rows (should be 0).\n`);

  console.log("🔄 Mapping JSON fields → Supabase columns…");
  const rows = records.map((r, i) => mapRecord(r, i));
  
  console.log("⬆️  Inserting into products table…");
  await batchInsert(rows);

  const afterCount = await countProducts();
  console.log(`\n📊 Products table AFTER: ${afterCount} rows`);
  console.log(`\n✅ Done! Replaced ${beforeCount} → ${afterCount} products.`);
} catch (err) {
  console.error("\n💥 FATAL ERROR:", err.message || err);
  process.exit(1);
}
