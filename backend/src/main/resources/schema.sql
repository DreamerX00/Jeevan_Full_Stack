-- This script will be executed on startup if spring.datasource.initialization-mode=always
-- It's useful for creating the database schema or initial data

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Set search path
SET search_path TO public;

-- Note: Spring Boot JPA will handle table creation automatically through Hibernate when
-- spring.jpa.hibernate.ddl-auto=update is set in application.properties
-- This file is mainly for any additional database setup that JPA might not handle

-- You can add any additional database setup here if needed 

-- First verify if the users table exists, then check for the role column
DO $$
BEGIN
    -- Only proceed if the users table exists
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
    ) THEN
        -- Check if the role column exists, if not add it
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'role'
        ) THEN
            -- Add the role column without constraints initially
            ALTER TABLE users ADD COLUMN role VARCHAR(255);
            
            -- Update all existing rows to have the default USER role
            UPDATE users SET role = 'USER';
            
            -- Now add the NOT NULL constraint
            ALTER TABLE users ALTER COLUMN role SET NOT NULL;
        END IF;
    END IF;
END
$$;

-- Add the check constraint only if it doesn't exist and the table exists
DO $$
BEGIN
    -- Only proceed if the users table exists
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
    ) THEN
        -- Check if the constraint exists
        IF NOT EXISTS (
            SELECT FROM information_schema.constraint_column_usage 
            WHERE constraint_name = 'check_role' AND table_name = 'users'
        ) THEN
            ALTER TABLE users ADD CONSTRAINT check_role CHECK (role IN ('USER', 'ADMIN', 'DOCTOR', 'PHARMACIST'));
        END IF;
    END IF;
END
$$; 