import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hbfhllfpjhgajxroewpu.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmhsbGZwamhnYWp4cm9ld3B1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjExODk0OCwiZXhwIjoyMDkxNjk0OTQ4fQ.uFrpwKsNrVqNi67RRwtdCyLqFDroptES6a8oI6IpoIk";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function extractAuthors() {
  console.log("Fetching products with missing or unknown authors...");
  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, description")
    .or("author.is.null, author.eq.Unknown Author, author.eq.Unknown, author.eq.null");

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(`Found ${products.length} products to analyze.`);

  let updatedCount = 0;
  const BATCH_SIZE = 100;
  
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const updates = [];

    for (const p of batch) {
      let author = null;
      const title = p.title || "";
      const desc = p.description || "";

      // Pattern 1: Title by Author Name (case insensitive, aggressive)
      const byMatch = title.match(/(.+)\s+by\s+([^,:(.]+)/i);
      if (byMatch && byMatch[2]) {
        author = byMatch[2].trim();
      }

      // Pattern 2: Author: Name in description or title
      if (!author) {
        const authMatch = (title + " " + desc).match(/Author:\s*([^,:(.\n]+)/i);
        if (authMatch && authMatch[1]) {
          author = authMatch[1].trim();
        }
      }

      // Pattern 3: written by Name
      if (!author) {
        const writtenByMatch = (title + " " + desc).match(/written\s+by\s+([^,:(.\n]+)/i);
        if (writtenByMatch && writtenByMatch[1]) {
          author = writtenByMatch[1].trim();
        }
      }

      // Pattern 4: BY [NAME] at the end of title
      if (!author) {
        const capsByMatch = title.match(/\s+BY\s+([A-Z\s]+)$/);
        if (capsByMatch && capsByMatch[1]) {
          author = capsByMatch[1].trim();
        }
      }

      if (author && author.length > 2 && author.length < 60) {
        // Clean up common noise and titles
        author = author.replace(/^(the|a|an|by)\s+/i, "");
        author = author.split(/\s+is\s+/i)[0]; // Remove trailing "is a..."
        author = author.split(/\s+has\s+/i)[0];
        author = author.trim();
        
        if (author.length > 2) {
          updates.push({ id: p.id, author });
        }
      }
    }

    if (updates.length > 0) {
      for (const update of updates) {
        const { error: upErr } = await supabase
          .from("products")
          .update({ author: update.author })
          .eq("id", update.id);
        if (!upErr) updatedCount++;
      }
      console.log(`Updated ${updatedCount} authors so far...`);
    }
  }

  console.log(`Extraction complete. Total authors updated: ${updatedCount}`);
}

extractAuthors().catch(console.error);
