-- Update links table to use position instead of order (order is a reserved keyword)
ALTER TABLE public.links RENAME COLUMN "order" TO position;

-- Ensure position column is not null and has a default value
ALTER TABLE public.links 
  ALTER COLUMN position SET NOT NULL,
  ALTER COLUMN position SET DEFAULT 0;