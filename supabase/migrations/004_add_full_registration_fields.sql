-- Add new fields to registrations table for complete registration form

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS belt VARCHAR(50),
ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS city VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS phone_alt VARCHAR(20),
ADD COLUMN IF NOT EXISTS social_security_number VARCHAR(20) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS is_self_registration BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS guardian_first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS guardian_last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS guardian_address TEXT,
ADD COLUMN IF NOT EXISTS guardian_postal_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS guardian_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS guardian_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS guardian_email VARCHAR(255);

-- Remove emergency_contact column as it's replaced by guardian information
ALTER TABLE public.registrations
DROP COLUMN IF EXISTS emergency_contact;

-- Add comments for documentation
COMMENT ON COLUMN public.registrations.belt IS 'Belt level (optional)';
COMMENT ON COLUMN public.registrations.address IS 'Practitioner address';
COMMENT ON COLUMN public.registrations.postal_code IS 'Postal code';
COMMENT ON COLUMN public.registrations.city IS 'City';
COMMENT ON COLUMN public.registrations.phone_alt IS 'Alternative phone number (optional)';
COMMENT ON COLUMN public.registrations.social_security_number IS 'Social security number';
COMMENT ON COLUMN public.registrations.is_self_registration IS 'True if registering for oneself, false if for a minor';
COMMENT ON COLUMN public.registrations.guardian_first_name IS 'Legal guardian first name (if minor)';
COMMENT ON COLUMN public.registrations.guardian_last_name IS 'Legal guardian last name (if minor)';
COMMENT ON COLUMN public.registrations.guardian_address IS 'Legal guardian address (if minor)';
COMMENT ON COLUMN public.registrations.guardian_postal_code IS 'Legal guardian postal code (if minor)';
COMMENT ON COLUMN public.registrations.guardian_city IS 'Legal guardian city (if minor)';
COMMENT ON COLUMN public.registrations.guardian_phone IS 'Legal guardian phone (if minor)';
COMMENT ON COLUMN public.registrations.guardian_email IS 'Legal guardian email (if minor)';
