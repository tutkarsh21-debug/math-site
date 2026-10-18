-- Run once on the live database and on any local copy.
-- A student who forgot the password asks for a reset on the Login page; the owner sees the request at /admin and sets a temporary password.
CREATE TABLE IF NOT EXISTS password_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, created_at INTEGER NOT NULL, done_at INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS password_requests_open ON password_requests(done_at, created_at);
