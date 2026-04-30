import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const CATEGORY_RULES = {
  'fiction': {
    keywords: {
      title: ['novel', 'fiction', 'story', 'stories', 'tales', 'fables', 'saga', 'trilogy'],
      description: ['fiction', 'novel', 'story', 'narrative', 'characters', 'plot', 'protagonist'],
      author: ['stephen king', 'j.k. rowling', 'haruki murakami', 'chimamanda', 'ngugi', 
               'taylor jenkins reid', 'lucinda riley', 'akwaeke emezi', 'colson whitehead']
    },
    exclusions: ['non-fiction', 'textbook', 'workbook', 'guide', 'manual']
  },
  'non-fiction': {
    keywords: {
      title: ['biography', 'autobiography', 'memoir', 'true story', 'history of', 'science of'],
      description: ['non-fiction', 'biography', 'autobiography', 'memoir', 'true story', 'historical account']
    },
    exclusions: ['fiction', 'novel']
  },
  'children-education': {
    keywords: {
      title: ['grade', 'std', 'class', 'pupil', 'primary', 'kcpe', 'workbook', 'activity book', 'pp1', 'pp2', 'children', 'kids'],
      description: ['pupil', 'grade', 'primary school', 'curriculum', 'kcpe', 'workbook', 'activity book', 'children', 'kids']
    }
  },
  'self-help': {
    keywords: {
      title: ['how to', 'guide to', 'steps to', 'ways to', 'art of', 'power of', 'habits', 'mindset', 'success', 'motivation'],
      description: ['self-help', 'personal development', 'motivation', 'inspire', 'transform your life']
    }
  },
  'religion': {
    keywords: {
      title: ['bible', 'quran', 'koran', 'christian', 'islam', 'muslim', 'prayer', 'faith', 'spiritual', 'god', 'jesus', 'allah'],
      description: ['bible', 'scripture', 'christian', 'islam', 'muslim', 'faith', 'prayer', 'spiritual', 'god', 'jesus', 'allah']
    }
  },
  'business': {
    keywords: {
      title: ['business', 'mba', 'management', 'leadership', 'entrepreneurship', 'startup', 'marketing', 'finance', 'economics'],
      description: ['business', 'entrepreneur', 'management', 'leadership', 'strategy', 'ceo', 'company', 'corporate']
    }
  },
  'history': {
    keywords: {
      title: ['history', 'historical', 'war', 'revolution', 'independence', 'colonial', 'ancient', 'medieval', 'empire'],
      description: ['history', 'historical', 'century', 'era', 'period', 'ancient', 'colonial', 'independence']
    }
  },
  'technology': {
    keywords: {
      title: ['technology', 'tech', 'digital', 'computer', 'programming', 'coding', 'software', 'ai', 'artificial intelligence'],
      description: ['technology', 'computer', 'programming', 'software', 'digital', 'algorithm', 'artificial intelligence']
    }
  },
  'lifestyle': {
    keywords: {
      title: ['cooking', 'recipes', 'food', 'health', 'fitness', 'diet', 'nutrition', 'wellness', 'yoga', 'meditation'],
      description: ['lifestyle', 'cooking', 'recipes', 'health', 'fitness', 'diet', 'nutrition', 'wellness']
    }
  }
};

/**
 * Scoring and Categorization Helpers
 */

function calculateQualityScore(book) {
  let score = 0;
  if (book.author && book.author !== 'Unknown') score += 30;
  if (book.description && book.description.length > 100) score += 25;
  else if (book.description && book.description.length > 20) score += 10;
  
  const hasImage = (book.images && book.images.length > 0 && book.images[0].length > 10) || 
                   (book.image_url && book.image_url.length > 10);
  if (hasImage) score += 15;
  if (book.price && book.price > 0) score += 10;
  if (book.stock && book.stock > 0) score += 10;
  if (book.title && book.title.length > 5 && book.title.length < 200) score += 10;
  
  return score;
}

function getMatchScore(text, keywords, weight) {
  if (!keywords) return 0;
  return keywords.filter(kw => text.includes(kw)).length * weight;
}

function identifyCategory(book) {
  const title = (book.title || '').toLowerCase();
  const description = (book.description || '').toLowerCase();
  const author = (book.author || '').toLowerCase();
  
  const matches = [];
  for (const [name, rules] of Object.entries(CATEGORY_RULES)) {
    if (rules.exclusions?.some(exc => title.includes(exc) || description.includes(exc))) continue;
    
    let score = 0;
    score += getMatchScore(title, rules.keywords.title, 3);
    score += getMatchScore(description, rules.keywords.description, 2);
    score += getMatchScore(author, rules.keywords.author, 2);
    
    if (score > 0) matches.push({ name, score });
  }
  
  return matches.toSorted((a, b) => b.score - a.score)[0]?.name || 'all-categories';
}

/**
 * Data Fetching and Updating Helpers
 */

async function fetchAllProducts() {
  let all = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('id, title, description, author, images, image_url, price, stock')
      .range(page * pageSize, (page + 1) * pageSize - 1);
      
    if (error) throw error;
    if (!data || data.length === 0) break;
    
    all = all.concat(data);
    console.log(`Fetched ${all.length} products...`);
    page++;
  }
  return all;
}

async function updateBatch(batch) {
  return Promise.all(batch.map(item => 
    supabase
      .from('products')
      .update({ 
        category: item.category, 
        category_id: item.category_id,
        quality_score: item.quality_score 
      })
      .eq('id', item.id)
  ));
}

// --- Main Execution ---

try {
  console.log('Initializing category mapping...');
  const { data: catData, error: catErr } = await supabase.from('categories').select('id, slug');
  if (catErr) throw catErr;
  const slugToId = Object.fromEntries(catData.map(c => [c.slug, c.id]));

  console.log('Fetching products...');
  const products = await fetchAllProducts();

  console.log('Calculating updates...');
  const updates = products.map(p => {
    const slug = identifyCategory(p);
    return {
      id: p.id,
      category: slug,
      category_id: slugToId[slug] || slugToId['all-categories'],
      quality_score: calculateQualityScore(p)
    };
  });

  console.log('Applying updates...');
  const batchSize = 100;
  for (let i = 0; i < updates.length; i += batchSize) {
    await updateBatch(updates.slice(i, i + batchSize));
    if ((i + batchSize) % 1000 === 0) console.log(`Progress: ${i + batchSize}/${updates.length}`);
  }

  console.log('Categorization and ranking complete!');
} catch (err) {
  console.error('Fatal Error:', err);
  process.exit(1);
}
