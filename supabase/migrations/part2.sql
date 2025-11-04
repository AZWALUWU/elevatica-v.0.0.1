-- Drop old statistical columns and add new text columns
-- ALTER TABLE public.blogs 
-- DROP COLUMN IF EXISTS mean,
-- DROP COLUMN IF EXISTS median,
-- DROP COLUMN IF EXISTS mode,
-- DROP COLUMN IF EXISTS variance,
-- DROP COLUMN IF EXISTS stdev;

-- Add new text columns for trading analysis
-- ALTER TABLE public.blogs
-- ADD COLUMN supply TEXT,
-- ADD COLUMN demmand TEXT,
-- ADD COLUMN rate_setup TEXT,
-- ADD COLUMN fundamental TEXT,
-- ADD COLUMN indikator TEXT;

-- Enable realtime for blogs table
ALTER PUBLICATION supabase_realtime ADD TABLE public.blogs;