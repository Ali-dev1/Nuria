
import requests

URL = "https://hbfhllfpjhgajxroewpu.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmhsbGZwamhnYWp4cm9ld3B1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjExODk0OCwiZXhwIjoyMDkxNjk0OTQ4fQ.uFrpwKsNrVqNi67RRwtdCyLqFDroptES6a8oI6IpoIk"
HEADERS = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}",
    "Content-Type": "application/json"
}

QUERIES = [
    ("3da2ff84-4926-4d9b-8126-68100b17476c", "Fiction", "title.ilike.*novel*,title.ilike.*story*,title.ilike.*fiction*,title.ilike.*stories*,title.ilike.*poem*,title.ilike.*poetry*,title.ilike.*literary*,title.ilike.*wa thiong*o*"),
    ("744327d5-cbb3-47d2-94b4-1b9e774b690d", "Religion", "title.ilike.*god*,title.ilike.*christ*,title.ilike.*faith*,title.ilike.*bible*,title.ilike.*scripture*,title.ilike.*worshipper*,title.ilike.*eden*,title.ilike.*triune*,title.ilike.*prayer*,title.ilike.*divine*,title.ilike.*providence*,title.ilike.*christian*,title.ilike.*islam*,title.ilike.*spiritual*,title.ilike.*well*"),
    ("bc371ef6-88cd-44fa-ad36-978dc82a4c65", "Business", "title.ilike.*business*,title.ilike.*wealth*,title.ilike.*investment*,title.ilike.*fintech*,title.ilike.*ceo*,title.ilike.*leadership*,title.ilike.*accountability*,title.ilike.*market*,title.ilike.*trade*,title.ilike.*liberalization*,title.ilike.*construction*,title.ilike.*industry*,title.ilike.*finance*,title.ilike.*money*,title.ilike.*rich*,title.ilike.*poverty*,title.ilike.*tax*,title.ilike.*profitable*"),
    ("3396f1ab-7d19-4081-90b5-709d4971a0ff", "Education", "title.ilike.*algebra*,title.ilike.*teach*,title.ilike.*training*,title.ilike.*els 202*,title.ilike.*grade*,title.ilike.*practitioner*,title.ilike.*legislative*,title.ilike.*syllabus*,title.ilike.*notes*,title.ilike.*grammar*,title.ilike.*primary*,title.ilike.*secondary*,title.ilike.*student*,title.ilike.*workbook*,title.ilike.*head start*,title.ilike.*reflector*,title.ilike.*mastery*"),
    ("4303e9ad-ccb9-40a4-a04b-0b99ca6c57b0", "Self-Help", "title.ilike.*mastery*,title.ilike.*habits*,title.ilike.*success*,title.ilike.*healing*,title.ilike.*growth*,title.ilike.*identity*,title.ilike.*becoming*,title.ilike.*mindset*,title.ilike.*wisdom*,title.ilike.*soul*,title.ilike.*gratitude*,title.ilike.*goals*,title.ilike.*resilience*,title.ilike.*empower*,title.ilike.*productivity*,title.ilike.*rewire*,title.ilike.*ultimate*,title.ilike.*triumph*"),
    ("9e848352-15d3-44e9-8210-e44898b33775", "Children", "title.ilike.*kids*,title.ilike.*child*,title.ilike.*children*,title.ilike.*baby*,title.ilike.*abc*,title.ilike.*junior*,title.ilike.*toro*,title.ilike.*monkeys*,title.ilike.*nursery*"),
    ("090afa7f-5d7a-4761-bb6e-f240e8ccde35", "History", "title.ilike.*history*,title.ilike.*sociology*,title.ilike.*empire*,title.ilike.*legacy*,title.ilike.*autobiography*,title.ilike.*decolonising*,title.ilike.*origins*,title.ilike.*freedom*,title.ilike.*colony*,title.ilike.*settler*,title.ilike.*kimathi*,title.ilike.*imperialism*,title.ilike.*mau mau*"),
    ("2781e14d-abf0-4e70-83e5-f0418df77292", "Technology", "title.ilike.*digital*,title.ilike.*ai*,title.ilike.*machine*,title.ilike.*internet*,title.ilike.*code*,title.ilike.*software*,title.ilike.*computer*,title.ilike.*frontiers*"),
    ("1afa1e45-a631-40da-8e0d-f7107fb3a96d", "Lifestyle", "title.ilike.*parenting*,title.ilike.*heart attack*,title.ilike.*food*,title.ilike.*nairobi*,title.ilike.*city*,title.ilike.*guide*,title.ilike.*cook*,title.ilike.*recipe*,title.ilike.*marriage*,title.ilike.*health*,title.ilike.*cancer*,title.ilike.*blood pressure*,title.ilike.*family*,title.ilike.*relationship*,title.ilike.*mums*")
]

def run():
    print("🚀 Running SQL Categorization Patch...")
    for cat_id, cat_name, filter_str in QUERIES:
        # We use PATCH with or=() for multi-pattern matching
        patterns = filter_str.split(',')
        or_filter = f"or=({','.join(patterns)})"
        
        r = requests.patch(f"{URL}/rest/v1/products?{or_filter}", headers=HEADERS, json={
            "category_id": cat_id,
            "category": cat_name
        })
        if r.status_code in [200, 201, 204]:
            print(f"✅ Categorized {cat_name}")
        else:
            print(f"❌ Failed {cat_name}: {r.text}")

    # Catch-all
    r = requests.patch(f"{URL}/rest/v1/products?category_id=is.null", headers=HEADERS, json={
        "category_id": "128bc710-81e2-41da-a52c-972fb7f609bf",
        "category": "Non-Fiction"
    })
    print("✅ Final Catch-all (Non-Fiction) completed.")

if __name__ == "__main__":
    run()
