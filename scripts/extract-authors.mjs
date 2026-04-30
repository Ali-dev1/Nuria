import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Extracts author from title and description using regex patterns
 */
function identifyAuthor(title = "", description = "") {
  // Pattern 1: Title by Author Name
  const byMatch = /(.+)\s+by\s+([^,:(.]+)/i.exec(title);
  if (byMatch?.[2]) return byMatch[2].trim();

  const combined = title + " " + description;
  
  // Pattern 2: Author: Name
  const authMatch = /Author:\s*([^,:(.\n]+)/i.exec(combined);
  if (authMatch?.[1]) return authMatch[1].trim();

  // Pattern 3: written by Name
  const writtenByMatch = /written\s+by\s+([^,:(.\n]+)/i.exec(combined);
  if (writtenByMatch?.[1]) return writtenByMatch[1].trim();

  // Pattern 4: BY [NAME] at the end
  const capsByMatch = /\s+BY\s+([A-Z\s]+)$/.exec(title);
  if (capsByMatch?.[1]) return capsByMatch[1].trim();

  return null;
}

/**
 * Cleans the extracted author string
 */
function cleanAuthorName(name) {
  if (!name || name.length <= 2 || name.length >= 60) return null;
  
  let cleaned = name
    .replace(/^(the|a|an|by)\s+/i, "")
    .split(/\s+is\s+/i)[0]
    .split(/\s+has\s+/i)[0]
    .trim();
    
  return cleaned.length > 2 ? cleaned : null;
}

/**
 * Updates a single record in the database
 */
async function updateProductAuthor(id, author) {
  const { error } = await supabase
    .from("products")
    .update({ author })
    .eq("id", id);
  return !error;
}

// --- Main Execution ---
console.log("Fetching products with missing or unknown authors...");
const { data: products, error } = await supabase
  .from("products")
  .select("id, title, description")
  .or("author.is.null, author.eq.Unknown Author, author.eq.Unknown, author.eq.null");

if (error) {
  console.error("Error fetching products:", error);
  process.exit(1);
}

console.log(`Found ${products.length} products to analyze.`);

let updatedCount = 0;
const BATCH_SIZE = 100;

for (let i = 0; i < products.length; i += BATCH_SIZE) {
  const batch = products.slice(i, i + BATCH_SIZE);
  const updates = batch
    .map(p => ({ id: p.id, rawAuthor: identifyAuthor(p.title, p.description) }))
    .map(u => ({ id: u.id, author: cleanAuthorName(u.rawAuthor) }))
    .filter(u => u.author !== null);

  for (const update of updates) {
    if (await updateProductAuthor(update.id, update.author)) {
      updatedCount++;
    }
  }
  console.log(`Updated ${updatedCount} authors so far...`);
}

console.log(`Extraction complete. Total authors updated: ${updatedCount}`);
