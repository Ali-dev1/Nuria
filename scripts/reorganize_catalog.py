
import requests
import json
import re

URL = "https://hbfhllfpjhgajxroewpu.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmhsbGZwamhnYWp4cm9ld3B1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjExODk0OCwiZXhwIjoyMDkxNjk0OTQ4fQ.uFrpwKsNrVqNi67RRwtdCyLqFDroptES6a8oI6IpoIk"
HEADERS = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json"
}

KEYWORDS = {
    "fiction": ["novel", "story", "fiction", "stories", "nurture", "desire", "deseria", "walt", "whisper", "thiongo", "poem", "poetry", "literary", "shreds", "bitter", "stuck here", "sizzling", "tamed"],
    "children": ["kids", "child", "children", "baby", "abc", "junior", "toro", "monkeys", "nursery"],
    "education": ["algebra", "teach", "training", "els 202", "grade", "practitioner", "legislative", "syllabus", "notes", "grammar", "primary", "secondary", "student", "workbook", "notes", "head start", "reflector", "mastery"],
    "self_help": ["mastery", "habits", "success", "healing", "growth", "identity", "becoming", "wealth", "mindset", "wisdom", "soul", "gratitude", "goals", "resilience", "empower", "productivity", "rewire", "ultimate", "triumph"],
    "religion": ["god", "christ", "faith", "bible", "scripture", "worshipper", "eden", "triune", "prayer", "divine", "providence", "christian", "islam", "spiritual", "abbas", "well"],
    "business": ["business", "wealth", "investment", "fintech", "ceo", "leadership", "accountability", "market", "trade", "liberalization", "construction", "industry", "finance", "money", "rich", "poverty", "tax", "profitable", "construction"],
    "history": ["history", "sociology", "empire", "legacy", "autobiography", "decolonising", "origins", "freedom", "colony", "settler", "kimathi", "imperialism", "mau mau"],
    "technology": ["digital", "fintech", "biotechnology", "ai", "machine", "internet", "code", "software", "computer", "frontiers"],
    "lifestyle": ["parenting", "heart attack", "food", "nairobi", "city", "guide", "cook", "recipe", "marriage", "health", "cancer", "blood pressure", "family", "relationship", "mums", "parenting"],
    "non_fiction": ["report", "analysis", "policy", "governance", "practice", "guide", "introduction"]
}

MAP = {
    "fiction": "3da2ff84-4926-4d9b-8126-68100b17476c",
    "non_fiction": "128bc710-81e2-41da-a52c-972fb7f609bf",
    "children": "9e848352-15d3-44e9-8210-e44898b33775",
    "education": "3396f1ab-7d19-4081-90b5-709d4971a0ff",
    "self_help": "4303e9ad-ccb9-40a4-a04b-0b99ca6c57b0",
    "religion": "744327d5-cbb3-47d2-94b4-1b9e774b690d",
    "business": "bc371ef6-88cd-44fa-ad36-978dc82a4c65",
    "history": "090afa7f-5d7a-4761-bb6e-f240e8ccde35",
    "technology": "2781e14d-abf0-4e70-83e5-f0418df77292",
    "lifestyle": "1afa1e45-a631-40da-8e0d-f7107fb3a96d"
}

def categorize(title):
    t = title.lower()
    for cat, words in KEYWORDS.items():
        for word in words:
            if word in t:
                return MAP[cat], cat.replace("_", "-").title()
    return MAP["non_fiction"], "Non-Fiction"

def run():
    print("🚀 Reorganizing 21k Catalog into 10 Categories...")
    
    # 1. Fetch all products (slug and title)
    # We'll do this in batches of 1000
    total_processed = 0
    limit = 1000
    offset = 0
    
    while True:
        r = requests.get(f"{URL}/rest/v1/products?select=id,title&limit={limit}&offset={offset}", headers=HEADERS)
        batch = r.json()
        if not batch: break
        
        updates = []
        for p in batch:
            cat_id, cat_name = categorize(p['title'])
            updates.append({
                "id": p['id'],
                "category_id": cat_id,
                "category": cat_name
            })
            
        # Bulk Upsert (by ID)
        upsert_headers = HEADERS.copy()
        upsert_headers["Prefer"] = "resolution=merge-duplicates"
        res = requests.post(f"{URL}/rest/v1/products", headers=upsert_headers, json=updates)
        if res.status_code not in [200, 201, 204]:
            print(f"❌ Error in batch {offset}: {res.text}")
        else:
            total_processed += len(batch)
            print(f"✅ Processed {total_processed} items...")
            
        offset += limit

    print("🎉 REORGANIZATION COMPLETE!")

if __name__ == "__main__":
    run()
