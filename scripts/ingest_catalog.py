
import json
import re
import requests
import os
import sys

# Configuration from environment
URL = "https://hbfhllfpjhgajxroewpu.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmhsbGZwamhnYWp4cm9ld3B1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjExODk0OCwiZXhwIjoyMDkxNjk0OTQ4fQ.uFrpwKsNrVqNi67RRwtdCyLqFDroptES6a8oI6IpoIk"
JSON_PATH = "/Users/khadir/Downloads/new supabase db.json"

HEADERS = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def parse_url(url):
    try:
        match = re.search(r'/product/([^/]+)', url)
        if not match: return "Unknown Title", "Nuria Author", f"unknown-{os.urandom(4).hex()}"
        slug = match.group(1).strip('/')
        
        title = ""
        author = "Nuria Author"
        
        if '-by-' in slug:
            parts = slug.split('-by-', 1)
            title = parts[0].replace('-', ' ').title()
            author = parts[1].replace('-', ' ').title()
        else:
            title = slug.replace('-', ' ').title()
            
        return title.strip(), author.strip(), slug
    except Exception:
        return "Unknown Title", "Nuria Author", f"err-{os.urandom(4).hex()}"

def run_ingestion():
    print("🚀 Starting Clean Production Ingestion...")
    print(f"Target Project: {URL}")

    # Read JSON
    print(f"Reading catalog from {JSON_PATH}...")
    try:
        with open(JSON_PATH, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"❌ ERROR: Source JSON not found at {JSON_PATH}")
        return

    print(f"📦 Loaded {len(data)} items. Beginning upsert...")

    # Batch Process
    batch_size = 500
    for i in range(0, len(data), batch_size):
        batch = data[i:i+batch_size]
        payload = []
        for item in batch:
            title, author, slug = parse_url(item['url'])
            
            final_title = item.get('title') or title
            final_author = author if (not item.get('author') or item['author'] == 'Nuria Author') else item['author']
            
            # We explicitly leave category_id NULL so the Master SQL logic can categorize them post-import
            payload.append({
                "title": final_title,
                "author": final_author,
                "slug": slug,
                "price": float(item.get('sale') or item.get('reg') or 0),
                "original_price": float(item.get('reg') or 0),
                "image_url": item.get('img'),
                "curation_priority": 10,
                "stock": 50,
                "format": "physical"
            })
            
        r = requests.post(f"{URL}/rest/v1/products", headers=HEADERS, json=payload)
        if r.status_code not in [200, 201, 204]:
            print(f"⚠️ Batch {i} Warning: {r.status_code}")
            print(f"Error: {r.text[:200]}...")
        else:
            print(f"✅ Copied {i + len(batch)} / {len(data)} books...")

    print("🎉 INGESTION COMPLETE! Please run the SQL Categorization block to organize the books.")

if __name__ == "__main__":
    run_ingestion()
