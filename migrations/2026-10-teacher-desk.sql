-- Teacher accounts, solved-on-whiteboard doubts and "doubt resolved" notifications. Only adds columns and tables.
-- Run once on the live database and on any local copy:  npx wrangler d1 execute mathsetu --remote --file=migrations/2026-10-teacher-desk.sql
ALTER TABLE users ADD COLUMN is_teacher INTEGER NOT NULL DEFAULT 0;
ALTER TABLE doubts ADD COLUMN seen_at INTEGER NOT NULL DEFAULT 0;
ALTER TABLE doubts ADD COLUMN solved_by INTEGER NOT NULL DEFAULT 0;
UPDATE doubts SET seen_at = answered_at WHERE answered_at > 0;   -- doubts answered before this change are not "new" to the student
CREATE INDEX IF NOT EXISTS doubts_unseen ON doubts(user_id, answered_at, seen_at);
CREATE TABLE IF NOT EXISTS solutions (doubt_id INTEGER PRIMARY KEY, teacher_id INTEGER NOT NULL, strokes TEXT NOT NULL, duration_ms INTEGER NOT NULL DEFAULT 0,
  audio_mime TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS solution_audio (doubt_id INTEGER NOT NULL, seq INTEGER NOT NULL, data TEXT NOT NULL, PRIMARY KEY (doubt_id, seq));
