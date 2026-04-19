CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_room_id ON messages (room_id);
CREATE INDEX IF NOT EXISTS idx_sender_id ON messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_timestamp ON messages (timestamp);
CREATE INDEX IF NOT EXISTS idx_sender_id_timestamp ON messages (sender_id, timestamp DESC);