
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const JSON_PATH = '/Users/khadir/Downloads/nuria_full_extract_1775934763265.json';
const BATCH_SIZE = 500;

function parseUrl(url) {
  try {
    const slug = url.split('/product/')[1].split('/')[0];
    let title = '';
    let author = 'Nuria Author';

    if (slug.includes('-by-')) {
      const parts = slug.split('-by-');
      title = parts[0].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      author = parts[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } else {
      title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    return { title, author, slug };
  } catch (e) {
    return { title: 'Unknown Title', author: 'Nuria Author', slug: `unknown-${Math.random()}` };
  }
}

async function startIngestion() {
  console.log('🚀 Starting Nuria Production Ingestion...');

  // 1. Ensure "General Catalog" category exists
  const { data: catData, error: catErr } = await supabase
    .from('categories')
    .upsert({ name: 'General Catalog', slug: 'general-catalog' })
    .select()
    .single();

  if (catErr) {
    console.error('Failed to create category:', catErr);
    return;
  }
  const categoryId = catData.id;
  console.log('✅ Category "General Catalog" ready.');

  // 2. Read JSON
  const rawData = fs.readFileSync(JSON_PATH, 'utf8');
  const catalog = JSON.parse(rawData);
  console.log(`📦 Loaded ${catalog.length} items from JSON.`);

  // 3. Process in batches
  for (let i = 0; i < catalog.length; i += BATCH_SIZE) {
    const batch = catalog.slice(i, i + BATCH_SIZE);
    const transformed = batch.map(item => {
      const { title, author, slug } = parseUrl(item.url);
      
      return {
        title: item.title || title,
        author: (item.author && item.author !== 'Nuria Author') ? item.author : author,
        slug: slug,
        price: parseFloat(item.sale || item.reg || 0),
        original_price: parseFloat(item.reg || 0),
        image_url: item.img,
        category: 'General Catalog',
        category_id: categoryId,
        curation_priority: 10,
        stock: 50, // Default stock
        format: 'physical'
      };
    });

    const { error } = await supabase.from('products').upsert(transformed, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error in batch ${i / BATCH_SIZE}:`, error.message);
    } else {
      console.log(`✅ Processed items ${i} to ${Math.min(i + BATCH_SIZE, catalog.length)}...`);
    }
  }

  console.log('🎉 INGESTION COMPLETE!');
}

startIngestion();
