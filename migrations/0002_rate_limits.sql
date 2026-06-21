CREATE TABLE IF NOT EXISTS rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS rate_limits_lookup_idx ON rate_limits(ip_hash, endpoint, created_at);
CREATE INDEX IF NOT EXISTS rate_limits_cleanup_idx ON rate_limits(endpoint, created_at);
