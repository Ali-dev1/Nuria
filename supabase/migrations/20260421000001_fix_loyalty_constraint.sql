-- 🛠️ FIX LOYALTY CONSTRAINT MISMATCH
-- This script updates the allowed values for loyalty transaction types to match the frontend code.

-- 1. Drop the old constraint
ALTER TABLE public.loyalty_transactions 
DROP CONSTRAINT IF EXISTS loyalty_transactions_type_check;

-- 2. Add the updated constraint to allow both sets of terminology
ALTER TABLE public.loyalty_transactions 
ADD CONSTRAINT loyalty_transactions_type_check 
CHECK (type IN ('earn', 'redeem', 'earned', 'redeemed'));

-- 3. Cleanup existing data (Optional but recommended)
-- This ensures all previous records are standardized if any were inserted manually
UPDATE public.loyalty_transactions SET type = 'earned' WHERE type = 'earn';
UPDATE public.loyalty_transactions SET type = 'redeemed' WHERE type = 'redeem';
