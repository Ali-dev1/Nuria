import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Category keywords and patterns from user script
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
      description: ['non-fiction', 'biography', 'autobiography', 'memoir', 'true story', 
                   'historical account', 'based on true']
    },
    exclusions: ['fiction', 'novel']
  },
  
  'children-education': {
    keywords: {
      title: ['grade', 'std', 'class', 'pupil', 'primary', 'kcpe', 'workbook', 'activity book',
              'pp1', 'pp2', 'children', 'kids', 'bedtime stories', 'colouring', 'phonics'],
      description: ['pupil', 'grade', 'primary school', 'curriculum', 'kcpe', 'workbook', 
                   'activity book', 'children', 'kids', 'ages 3-', 'ages 4-', 'ages 5-']
    }
  },
  
  'self-help': {
    keywords: {
      title: ['how to', 'guide to', 'steps to', 'ways to', 'art of', 'power of', 'habits', 
              'mindset', 'success', 'motivation', 'self-help', 'personal development',
              'transformation', 'fulfilling life'],
      description: ['self-help', 'personal development', 'motivation', 'inspire', 'transform your life',
                   'achieve success', 'build confidence', 'overcome', 'improve yourself']
    }
  },
  
  'religion': {
    keywords: {
      title: ['bible', 'quran', 'koran', 'christian', 'islam', 'muslim', 'prayer', 'faith', 
              'devotional', 'spiritual', 'god', 'jesus', 'allah', 'church', 'mosque', 'theology'],
      description: ['bible', 'scripture', 'christian', 'islam', 'muslim', 'faith', 'prayer',
                   'spiritual', 'god', 'jesus', 'allah', 'religious', 'devotion', 'worship']
    }
  },
  
  'business': {
    keywords: {
      title: ['business', 'mba', 'management', 'leadership', 'entrepreneurship', 'startup',
              'marketing', 'strategy', 'finance', 'economics', 'investing', 'sales'],
      description: ['business', 'entrepreneur', 'management', 'leadership', 'strategy', 'ceo',
                   'company', 'corporate', 'marketing', 'sales', 'finance', 'investment',
                   'economics', 'trade', 'commerce']
    }
  },
  
  'history': {
    keywords: {
      title: ['history', 'historical', 'war', 'revolution', 'independence', 'colonial', 
              'ancient', 'medieval', 'empire', '1938', '1945', 'world war'],
      description: ['history', 'historical', 'century', 'era', 'period', 'ancient', 
                   'colonial', 'independence', 'war', 'revolution', 'empire']
    }
  },
  
  'technology': {
    keywords: {
      title: ['technology', 'tech', 'digital', 'computer', 'programming', 'coding', 'software',
              'ai', 'artificial intelligence', 'data', 'cyber', 'internet', 'smartphone'],
      description: ['technology', 'computer', 'programming', 'software', 'digital', 'algorithm',
                   'artificial intelligence', 'machine learning', 'data', 'cyber', 'internet']
    }
  },
  
  'lifestyle': {
    keywords: {
      title: ['cooking', 'recipes', 'food', 'health', 'fitness', 'diet', 'nutrition', 'wellness',
              'yoga', 'meditation', 'fashion', 'beauty', 'home', 'garden', 'travel', 'hairstyles'],
      description: ['lifestyle', 'cooking', 'recipes', 'health', 'fitness', 'diet', 'nutrition',
                   'wellness', 'exercise', 'yoga', 'meditation', 'fashion', 'beauty', 'home decor',
                   'gardening', 'travel']
    }
  }
};

// Calculate quality score for ranking
function calculateQualityScore(book) {
  let score = 0;
  
  // Factor 1: Has known author (30 points)
  if (book.author && book.author !== 'Unknown') {
    score += 30;
  }
  
  // Factor 2: Has substantial description (25 points)
  if (book.description && book.description.length > 100) {
    score += 25;
  } else if (book.description && book.description.length > 20) {
    score += 10;
  }
  
  // Factor 3: Has image (15 points)
  const hasImage = (book.images && book.images.length > 0 && book.images[0].length > 10) || 
                   (book.image_url && book.image_url.length > 10);
  if (hasImage) {
    score += 15;
  }
  
  // Factor 4: Price consistency (10 points)
  if (book.price && book.price > 0) {
    score += 10;
  }
  
  // Factor 5: Stock availability (10 points)
  if (book.stock && book.stock > 0) {
    score += 10;
  }
  
  // Factor 6: Title quality (10 points)
  if (book.title && book.title.length > 5 && book.title.length < 200) {
    // Deduct points for malformed titles
    if (book.title.includes('By') && book.title.endsWith('By')) {
      score += 2; // Incomplete title
    } else if (book.title.toLowerCase().includes('isbn')) {
      score += 5; // ISBN in title is suboptimal
    } else {
      score += 10; // Good title
    }
  }
  
  return score;
}

// Categorize a single book
function categorizeBook(book) {
  const title = (book.title || '').toLowerCase();
  const description = (book.description || '').toLowerCase();
  const author = (book.author || '').toLowerCase();
  
  const categories = [];
  
  for (const [categoryName, rules] of Object.entries(CATEGORY_RULES)) {
    let matchScore = 0;
    
    if (rules.exclusions) {
      const hasExclusion = rules.exclusions.some(exc => 
        title.includes(exc) || description.includes(exc)
      );
      if (hasExclusion) continue;
    }
    
    if (rules.keywords.title) {
      const titleMatches = rules.keywords.title.filter(kw => title.includes(kw));
      matchScore += titleMatches.length * 3;
    }
    
    if (rules.keywords.description) {
      const descMatches = rules.keywords.description.filter(kw => description.includes(kw));
      matchScore += descMatches.length * 2;
    }
    
    if (rules.keywords.author) {
      const authorMatches = rules.keywords.author.filter(kw => author.includes(kw));
      matchScore += authorMatches.length * 2;
    }
    
    if (matchScore > 0) {
      categories.push({ name: categoryName, score: matchScore });
    }
  }
  
  categories.sort((a, b) => b.score - a.score);
  return categories.length > 0 ? categories[0].name : 'all-categories';
}

async function run() {
  console.log('Fetching categories from Supabase...');
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('categories')
    .select('id, slug');
    
  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    process.exit(1);
  }
  
  const slugToId = Object.fromEntries(categoriesData.map(c => [c.slug, c.id]));
  console.log('Category mapping loaded.');

  console.log('Fetching products from Supabase...');
  
  let allProducts = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('id, title, description, author, images, image_url, price, stock')
      .range(page * pageSize, (page + 1) * pageSize - 1);
      
    if (error) {
      console.error('Error fetching products:', error);
      break;
    }
    
    if (!data || data.length === 0) break;
    
    allProducts = allProducts.concat(data);
    console.log(`Fetched ${allProducts.length} products...`);
    page++;
  }
  
  console.log(`Total products fetched: ${allProducts.length}`);
  
  const updates = allProducts.map(product => {
    const categorySlug = categorizeBook(product);
    return {
      id: product.id,
      category: categorySlug,
      category_id: slugToId[categorySlug] || slugToId['all-categories'],
      quality_score: calculateQualityScore(product)
    };
  });
  
  console.log('Starting updates in batches...');
  
  const batchSize = 100;
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    
    await Promise.all(batch.map(item => 
      supabase
        .from('products')
        .update({ 
          category: item.category, 
          category_id: item.category_id,
          quality_score: item.quality_score 
        })
        .eq('id', item.id)
    ));
    
    if ((i + batchSize) % 1000 === 0 || i + batchSize >= updates.length) {
      console.log(`Updated ${Math.min(i + batchSize, updates.length)}/${updates.length} products...`);
    }
  }
  
  console.log('Categorization and ranking complete!');
}

run().catch(console.error);
