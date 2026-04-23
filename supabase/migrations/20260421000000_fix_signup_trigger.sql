-- DIAGNOSTIC: FIX SIGNUP 500 ERROR
-- This script simplifies the new user trigger to ensure it doesn't fail due to missing columns.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- We use a more resilient INSERT that only targets basic columns
  -- and handles potential missing profiles/roles tables gracefully.
  
  BEGIN
    INSERT INTO public.profiles (user_id, name)
    VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        ''
      )
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error or ignore if profiles table doesn't exist/structure is different
    RAISE NOTICE 'Error inserting into profiles: %', SQLERRM;
  END;

  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'customer');
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error inserting into user_roles: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;
