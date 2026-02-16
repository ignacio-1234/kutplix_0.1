-- Add designer_id to companies table to link clients to designers
ALTER TABLE public.companies 
ADD COLUMN designer_id uuid REFERENCES public.designers(id);

-- Optional: Index for performance
CREATE INDEX idx_companies_designer_id ON public.companies(designer_id);
