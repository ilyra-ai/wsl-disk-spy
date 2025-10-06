-- Fix function search path
DROP FUNCTION IF EXISTS public.cleanup_old_analyses();

CREATE OR REPLACE FUNCTION public.cleanup_old_analyses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.disk_analyses
  WHERE id NOT IN (
    SELECT id FROM public.disk_analyses
    ORDER BY created_at DESC
    LIMIT 50
  );
END;
$$;