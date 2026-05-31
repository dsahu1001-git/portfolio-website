CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'unsubscribed')),
  confirmation_token_hash TEXT,
  unsubscribe_token_hash TEXT,
  source TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  created_at TEXT NOT NULL,
  confirmed_at TEXT,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS subscribers_status_idx ON subscribers(status);
CREATE INDEX IF NOT EXISTS subscribers_confirmation_token_idx ON subscribers(confirmation_token_hash);
CREATE INDEX IF NOT EXISTS subscribers_unsubscribe_token_idx ON subscribers(unsubscribe_token_hash);

CREATE TABLE IF NOT EXISTS subscriber_topics (
  subscriber_email TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('ai', 'quantum')),
  enabled INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (subscriber_email, topic),
  FOREIGN KEY (subscriber_email) REFERENCES subscribers(email) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS consent_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscriber_email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}',
  occurred_at TEXT NOT NULL,
  FOREIGN KEY (subscriber_email) REFERENCES subscribers(email) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS consent_events_subscriber_idx ON consent_events(subscriber_email);

CREATE TABLE IF NOT EXISTS game_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game TEXT NOT NULL,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  completed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS game_scores_game_idx ON game_scores(game);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  product TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  clicked_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS affiliate_clicks_category_idx ON affiliate_clicks(category);
