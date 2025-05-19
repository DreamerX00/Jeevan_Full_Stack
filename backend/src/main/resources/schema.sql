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

-- First verify if the role column exists, if not add it
DO $$
BEGIN
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
END
$$;

-- Now add the NOT NULL constraint and check constraint
ALTER TABLE users ADD CONSTRAINT check_role CHECK (role IN ('USER', 'ADMIN', 'DOCTOR', 'PHARMACIST')); 