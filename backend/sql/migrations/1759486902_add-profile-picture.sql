-- Migration: Add profile_picture column to users table
-- Date: 2025-10-03

BEGIN;

ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;

COMMIT;
