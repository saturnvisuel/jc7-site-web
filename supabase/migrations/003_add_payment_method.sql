-- Add payment_method column to registrations table
ALTER TABLE public.registrations 
ADD COLUMN payment_method VARCHAR(50) DEFAULT 'carte' CHECK (payment_method IN ('carte', 'cheque', 'especes'));

-- Add comment for documentation
COMMENT ON COLUMN public.registrations.payment_method IS 'Payment method: carte (card), cheque, or especes (cash)';
