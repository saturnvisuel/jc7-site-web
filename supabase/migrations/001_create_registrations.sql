-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    emergency_contact VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    medical_note TEXT,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
    stripe_session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_registrations_email ON public.registrations(email);
CREATE INDEX idx_registrations_payment_status ON public.registrations(payment_status);
CREATE INDEX idx_registrations_created_at ON public.registrations(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE public.registrations IS 'Stores member registration data for JC7 judo club';
COMMENT ON COLUMN public.registrations.payment_status IS 'Payment status: pending, paid, or cancelled';
COMMENT ON COLUMN public.registrations.stripe_session_id IS 'Stripe Checkout Session ID for payment tracking';
