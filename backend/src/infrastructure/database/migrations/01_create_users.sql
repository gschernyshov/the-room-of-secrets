DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'blocked', 'deleted');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'user', 
  status user_status NOT NULL DEFAULT 'active',
  rooms UUID[] NOT NULL DEFAULT '{}',  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);