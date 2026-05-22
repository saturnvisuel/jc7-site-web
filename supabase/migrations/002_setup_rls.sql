-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can insert registrations" ON public.registrations;
DROP POLICY IF EXISTS "Authenticated users can view all registrations" ON public.registrations;
DROP POLICY IF EXISTS "Authenticated users can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Authenticated users can delete registrations" ON public.registrations;

-- Policy: Allow public to insert new registrations (for registration form)
CREATE POLICY "Public can insert registrations"
ON public.registrations
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Only authenticated users can view registrations (admin dashboard)
CREATE POLICY "Authenticated users can view all registrations"
ON public.registrations
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only authenticated users can update registrations (admin dashboard)
CREATE POLICY "Authenticated users can update registrations"
ON public.registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Only authenticated users can delete registrations (admin dashboard)
CREATE POLICY "Authenticated users can delete registrations"
ON public.registrations
FOR DELETE
TO authenticated
USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.registrations TO anon;
GRANT SELECT, UPDATE, DELETE ON public.registrations TO authenticated;
