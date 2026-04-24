# Admin Dashboard Fix Plan

**Audit Date:** 2026-04-24  
**Auditor:** Ops 🤓

---

## Issue Summary

| # | Component | Issue | Severity | Root Cause |
|---|-----------|-------|----------|------------|
| 1 | Inventory | Star icon behavior unclear | Medium | `is_featured` vs `is_active` confusion |
| 2 | Orders | Status changes don't persist, filter broken | **Critical** | Missing status filter in query, cache invalidation issue |
| 3 | Customers | Working | ✅ None | — |
| 4 | Vendors | Status logic confusing, "verified" badge mismatch | High | Status enum mismatch, unclear UX flow |
| 5 | Authors | Image upload succeeds but doesn't display | **Critical** | Storage bucket RLS or cache invalidation |
| 6 | Blog | Image upload fails | **Critical** | Storage bucket RLS or missing bucket |
| 7 | Settings | Page needs redesign | Low | Feature request |

---

## Detailed Analysis & Fixes

### 1️⃣ Inventory Page — Star Icon (Featured Toggle)

**Current Behavior:**
- Star icon toggles `is_featured` field
- Products with `is_featured: true` show amber star badge
- Separate "Live/Draft" toggle controls `is_active`

**Problem:**
Two separate visibility concepts confuse admins:
- `is_featured` = homepage visibility (Featured Titles section)
- `is_active` = catalog visibility (can be purchased)

**Fix Plan:**
1. Keep both fields but clarify UI labels:
   - Star button → "Feature on Homepage" (tooltip: "Shows in Featured Titles section")
   - Live/Draft → "Catalog Visibility" (tooltip: "Visible in browse/search")
2. Add visual indicator on featured products in table
3. Ensure homepage query filters by `is_featured: true`

**Files to Change:**
- `src/components/admin/ProductManagement/ProductRow.tsx` — Update tooltips
- `src/pages/Index.tsx` — Verify featured query uses `is_featured`

**Estimated Effort:** 30 min

---

### 2️⃣ Orders Page — Status Not Updating, Filter Broken

**Current Behavior:**
- Admin changes order status → gets "Status Synchronized" toast
- Database update may succeed but UI doesn't reflect change
- Status filter dropdown (pending/confirmed/shipped/delivered) shows nothing when clicked

**Root Cause:**
```typescript
// useAdminOrders hook — NO status filter parameter
export const useAdminOrders = (options?: { limit?: number, page?: number, pageSize?: number }) => {
  let query = supabase.from("orders").select("*", { count: "exact" });
  // ❌ No .eq("status", status) option
  ...
}

// OrderManagement component — client-side filter doesn't work
const filtered = orderStatusFilter === "all" ? data : data.filter((o: DbOrder) => o.status === orderStatusFilter);
// ❌ Filters AFTER fetch, but ordersData doesn't include all orders
```

**Fix Plan:**
1. Update `useAdminOrders` hook to accept `status` filter parameter
2. Add status to query key for proper cache invalidation
3. Ensure `updateOrderStatus` invalidates with correct query key
4. Fix export CSV to use filtered data correctly

**Code Changes:**
```typescript
// src/hooks/useAdmin.ts
export const useAdminOrders = (options?: { 
  limit?: number, 
  page?: number, 
  pageSize?: number,
  status?: "all" | "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
}) => {
  let query = supabase.from("orders").select("*", { count: "exact" });
  
  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }
  ...
}

// OrderManagement.tsx — update query key
queryKey: ["admin", "orders", { page, pageSize, status: orderStatusFilter }]
```

**Estimated Effort:** 1 hour

---

### 3️⃣ Customers Page — ✅ Working

No issues reported. Verified code looks correct.

---

### 4️⃣ Vendors Page — Status Logic Confusion

**Current Behavior:**
- Vendor applies → status: "pending"
- Admin approves → `is_verified: true`, `status: "active"`
- UI shows "verified" badge in orange with exclamation (confusing)

**Root Cause:**
```typescript
// VendorManagement.tsx status badges
const statusConfig = {
  active: { color: "bg-green-100 text-green-700...", icon: <CheckCircle /> },
  rejected: { color: "bg-red-100 text-red-700...", icon: <XCircle /> },
  pending: { color: "bg-amber-100 text-amber-700...", icon: <AlertCircle /> },
};
// ❌ No "verified" status in config, falls through to pending
```

**Problem:**
The code sets `status: "active"` but somewhere the UI displays "verified". This could be:
1. Database has old data with `status: "verified"`
2. Code path sets `status: "verified"` instead of `"active"`

**Fix Plan:**
1. Standardize on 3 statuses: `pending` → `active` → `rejected`
2. Remove `is_verified` boolean (redundant with status enum)
3. Update migration to normalize existing data
4. Update UI to show clear status badges
5. Consider consolidating into Customers page as user suggested

**Consolidation Option:**
- Merge vendor management into Customers page with "Vendor" filter
- Add "Become Vendor" action on customer rows
- Separate "Vendor Applications" tab for pending approvals only

**Files to Change:**
- `src/hooks/useAdmin.ts` — Remove `is_verified` logic
- `src/components/admin/VendorManagement.tsx` — Simplify status logic
- `supabase/migrations/` — Add migration to normalize vendor statuses

**Estimated Effort:** 2 hours (with consolidation: 4 hours)

---

### 5️⃣ Authors Page — Image Upload Succeeds But Doesn't Display

**Current Behavior:**
- Admin uploads author image → "Upload Successful" toast
- Image URL saved to database
- Neither admin nor customers see the image

**Root Cause Investigation:**
```typescript
// ImageUploader.tsx — uploads to "book-covers" bucket
const { error: uploadError } = await supabase.storage
  .from(bucket)  // default: "book-covers"
  .upload(filePath, file);

// AuthorManagement.tsx — saves URL correctly
const payload = {
  name: author.name,
  photo_url: author.photo_url || "",  // ✅ URL is saved
  bio: author.bio || "",
  slug: slug
};
```

**Possible Causes:**
1. **Storage RLS policy** — Admins may not have INSERT permission on `book-covers` bucket
2. **Bucket doesn't exist** — `book-covers` bucket may not be created in Supabase
3. **Cache not invalidating** — Query key mismatch between admin and public pages
4. **CORS issue** — Public URL not accessible

**Debug Steps:**
1. Check Supabase dashboard → Storage → `book-covers` bucket exists
2. Check RLS policies on `storage.objects` table
3. Verify public URL is accessible in browser
4. Check browser console for CORS errors

**Fix Plan:**
1. Create dedicated `author-photos` bucket (cleaner separation)
2. Add RLS policy for authenticated users (admins) to upload
3. Ensure both admin and public queries use same query key: `["authors"]`
4. Add cache invalidation on both success paths

**Files to Change:**
- `src/components/admin/AuthorManagement.tsx` — Use `author-photos` bucket
- `supabase/migrations/` — Create bucket + RLS policies
- Verify query keys match between admin + public author queries

**Estimated Effort:** 1 hour

---

### 6️⃣ Blog Page — Image Upload Fails

**Current Behavior:**
- Admin writes blog post → uploads hero image → upload fails

**Root Cause:**
Same as Authors page — storage bucket permissions or missing bucket.

**Fix Plan:**
1. Create dedicated `blog-images` bucket
2. Add RLS policy for authenticated users
3. Update `BlogManagement.tsx` to use new bucket
4. Test upload flow end-to-end

**Files to Change:**
- `src/components/admin/BlogManagement.tsx` — Use `blog-images` bucket
- `supabase/migrations/` — Create bucket + RLS policies

**Estimated Effort:** 30 min

---

### 7️⃣ Settings Page — Redesign Proposal

**Current State:**
Basic key-value editor for `platform_settings` table.

**Recommended Structure:**

#### A. Platform Configuration
- Maintenance Mode (toggle)
- Site Name / Branding
- Contact Info (email, phone)
- Social Media Links

#### B. Commerce Settings
- Free Delivery Threshold (KSh)
- Default Commission Rate (%)
- Tax Rate (%)
- Currency Settings

#### C. Announcements
- Banner Text
- Enable/Disable Toggle
- Start/End Dates

#### D. Feature Flags
- Enable Vendor Registration
- Enable Reviews
- Enable Wishlist
- Enable Loyalty Points

#### E. Storage Buckets
- Quick links to Supabase storage dashboard
- Bucket usage stats (if available)

**Files to Change:**
- `src/components/admin/PlatformSettings.tsx` — Complete rewrite
- `src/hooks/useAdmin.ts` — Add structured settings hook

**Estimated Effort:** 3 hours

---

## Storage Bucket Setup (Critical for #5, #6)

**Required Buckets:**
| Bucket | Purpose | RLS Policy |
|--------|---------|------------|
| `book-covers` | Product images | Authenticated users can upload |
| `author-photos` | Author profile images | Authenticated users can upload |
| `blog-images` | Blog post hero images | Authenticated users can upload |
| `vendor-docs` | Vendor verification docs | Vendors + Admins only |

**Migration Script:**
```sql
-- Create buckets if not exist
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('author-photos', 'author-photos', true),
  ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for author-photos
CREATE POLICY "Admins can upload author photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'author-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Public can read author photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'author-photos');

-- Same for blog-images
```

---

## Priority Order

1. **Orders Page** (#2) — Critical business function broken
2. **Authors Images** (#5) — Data loss risk (uploads succeed but invisible)
3. **Blog Images** (#6) — Same as above
4. **Vendors Status** (#4) — UX confusion, potential data integrity issue
5. **Inventory Star** (#1) — Clarification only, not broken
6. **Settings Redesign** (#7) — Feature request, lowest priority

---

## Testing Checklist

After fixes:
- [ ] Orders: Change status → refresh → status persists
- [ ] Orders: Filter by status → shows correct orders
- [ ] Authors: Upload image → visible immediately on admin + homepage
- [ ] Blog: Upload image → post saves with image
- [ ] Vendors: Approve vendor → shows "Active" in green with checkmark
- [ ] Inventory: Star product → appears in Featured section on homepage

---

**Ready to proceed?** I can start with the critical fixes (Orders + Storage buckets) first. Let me know which issue you want tackled first.
