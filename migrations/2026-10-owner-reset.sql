-- Run once on the live database and on any local copy.
-- Failed tries at the owner's secret-code password reset (/owner-reset), to keep guessing slow.
CREATE TABLE IF NOT EXISTS owner_reset_fails (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at INTEGER NOT NULL);
