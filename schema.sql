-- Tables of the D1 database "mathsetu" (student accounts and saved test scores).
-- Local copy for development:  npx wrangler d1 execute mathsetu --local --file=schema.sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, mobile TEXT NOT NULL UNIQUE, cls TEXT NOT NULL, board TEXT NOT NULL,
  pass_hash TEXT NOT NULL, salt TEXT NOT NULL, fails INTEGER NOT NULL DEFAULT 0, locked_until INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0);  -- 1 for the site owner, who can read the enquiries at /admin/enquiries
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, test TEXT NOT NULL, score INTEGER NOT NULL, total INTEGER NOT NULL, taken_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS results_user ON results(user_id, taken_at);
-- Enquiries sent through the form on the Enquiry page.
CREATE TABLE IF NOT EXISTS enquiries (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, mobile TEXT NOT NULL, cls TEXT NOT NULL, board TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS enquiries_time ON enquiries(created_at);
