-- Add visibility fields for interview address and contact phone
ALTER TABLE jobs 
ADD COLUMN show_interview_address BOOLEAN DEFAULT TRUE,
ADD COLUMN show_contact_phone BOOLEAN DEFAULT TRUE;

