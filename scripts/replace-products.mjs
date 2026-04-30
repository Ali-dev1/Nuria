#!/usr/bin/env node
/**
 * ============================================================
 *  NURIA — Products Table Replacement Script
 * ============================================================
 *  Reads NURIA_VAULT_CLEAN.json, truncates the existing
 *  products table (CASCADE), and bulk-inserts the new records.
 *
 *  Usage:
 *    node scripts/replace-products.mjs <path-to-json>
 *
 *  Example:
 *    node scripts/replace-products.mjs ./NURIA_VAULT_CLEAN.json
 * ============================================================
 */

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

// ── Config ───────────────────────────────────────────────────
const SUPABASE_URL = "https://hbfhllfpjhgajxroewpu.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmhsbGZwamhnYWp4cm9ld3B1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjExODk0OCwiZXhwIjoyMDkxNjk0OTQ4fQ.uFrpwKsNrVqNi67RRwtdCyLqFDroptES6a8oI6IpoIk";

const BATCH_SIZE = 500; // Insert rows in batches for reliability

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

// ── Helpers ──────────────────────────────────────────────────

/** Count rows in the products table */
async function countProducts() {
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(`Count failed: ${error.message}`);
  return count ?? 0;
}

/** Generate a URL-safe slug from a title */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120); // keep slugs reasonable length
}

/** Map a single JSON record → products row */
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
    // sensible defaults for required / commonly-used columns
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

/** Insert rows in batches */
async function batchInsert(rows) {
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("products").insert(batch);
    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
      throw error;
    }
    inserted += batch.length;
    console.log(
      `   ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1} — ${inserted}/${rows.length} rows inserted`
    );
  }
  return inserted;
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("Usage: node scripts/replace-products.mjs <path-to-json>");
    process.exit(1);
  }

  // 1. Read & parse JSON
  console.log(`\n📂 Reading ${jsonPath}…`);
  const raw = await readFile(resolve(jsonPath), "utf-8");
  const records = JSON.parse(raw);
  console.log(`   Found ${records.length} records in file.\n`);

  // 2. Count BEFORE
  const beforeCount = await countProducts();
  console.log(`📊 Products table BEFORE: ${beforeCount} rows\n`);

  // 3. TRUNCATE CASCADE
  console.log("🗑️  Truncating products table (CASCADE)…");
  const { error: truncErr } = await supabase.rpc("exec_sql", {
    query: "TRUNCATE public.products CASCADE;",
  });

  // If the RPC doesn't exist, fall back to a delete-all approach
  if (truncErr) {
    console.warn(
      `   ⚠ RPC exec_sql not available (${truncErr.message}).`
    );
    console.log("   Falling back to DELETE FROM products…");
    const { error: delErr } = await supabase
      .from("products")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // matches all rows
    if (delErr) throw new Error(`Delete fallback failed: ${delErr.message}`);
  }

  const afterTruncate = await countProducts();
  console.log(`   Table now has ${afterTruncate} rows (should be 0).\n`);

  // 4. Map records
  console.log("🔄 Mapping JSON fields → Supabase columns…");
  const rows = records.map((r, i) => mapRecord(r, i));
  console.log(`   Mapped ${rows.length} rows.\n`);

  // 5. Batch insert
  console.log("⬆️  Inserting into products table…");
  const totalInserted = await batchInsert(rows);

  // 6. Count AFTER
  const afterCount = await countProducts();
  console.log(`\n📊 Products table AFTER: ${afterCount} rows`);
  console.log(
    `\n✅ Done! Replaced ${beforeCount} → ${afterCount} products (${totalInserted} inserted).`
  );
}

main().catch((err) => {
  console.error("\n💥 FATAL ERROR:", err.message || err);
  process.exit(1);
});
