-- Create table for disk analyses
CREATE TABLE public.disk_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.disk_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public endpoint)
CREATE POLICY "Anyone can insert disk analyses" 
ON public.disk_analyses 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to view recent analyses
CREATE POLICY "Anyone can view disk analyses" 
ON public.disk_analyses 
FOR SELECT 
USING (true);

-- Create index for faster queries on created_at
CREATE INDEX idx_disk_analyses_created_at ON public.disk_analyses(created_at DESC);

-- Create function to clean up old analyses (keep only last 50)
CREATE OR REPLACE FUNCTION public.cleanup_old_analyses()
RETURNS void
LANGUAGE plpgsql
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