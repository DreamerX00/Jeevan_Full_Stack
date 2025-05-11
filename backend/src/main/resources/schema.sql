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