CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    participants INTEGER[] NOT NULL,  
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);