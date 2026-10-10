-- Tables of the D1 database "mathsetu" (student accounts and saved test scores).
-- Local copy for development:  npx wrangler d1 execute mathsetu --local --file=schema.sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, mobile TEXT NOT NULL UNIQUE, cls TEXT NOT NULL, board TEXT NOT NULL,
  pass_hash TEXT NOT NULL, salt TEXT NOT NULL, fails INTEGER NOT NULL DEFAULT 0, locked_until INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,  -- 1 for the site owner, who can open /admin
  is_teacher INTEGER NOT NULL DEFAULT 0,  -- 1 for a teacher, who can open /teacher and solve doubts
  -- Parent access: a code the student makes and gives to a parent (only its hash is kept), and the wrong-code lockout.
  parent_code_hash TEXT NOT NULL DEFAULT '', parent_code_at INTEGER NOT NULL DEFAULT 0, parent_fails INTEGER NOT NULL DEFAULT 0, parent_locked_until INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS results (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, test TEXT NOT NULL, score INTEGER NOT NULL, total INTEGER NOT NULL, taken_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS results_user ON results(user_id, taken_at);
-- Doubts asked by logged-in students on the Ask a Doubt page. "draft" is the AI's suggested answer, seen only by the owner
-- at /admin/doubts; "answer" is what the student sees, and answered_at is 0 until the owner sends it.
CREATE TABLE IF NOT EXISTS doubts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, chapter TEXT NOT NULL DEFAULT '', question TEXT NOT NULL,
  has_photo INTEGER NOT NULL DEFAULT 0, draft TEXT NOT NULL DEFAULT '', answer TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL, answered_at INTEGER NOT NULL DEFAULT 0,
  seen_at INTEGER NOT NULL DEFAULT 0,   -- when the student saw the answer (0 = not yet: shows as a notification)
  solved_by INTEGER NOT NULL DEFAULT 0);   -- the teacher who answered, if a teacher did
CREATE INDEX IF NOT EXISTS doubts_user ON doubts(user_id, created_at);
CREATE INDEX IF NOT EXISTS doubts_open ON doubts(answered_at, created_at);
-- The photo of a doubt, a small JPEG stored as base64 text. Kept in its own table so that lists of doubts stay light.
CREATE TABLE IF NOT EXISTS doubt_photos (doubt_id INTEGER PRIMARY KEY, data TEXT NOT NULL);
-- Enquiries sent through the form on the Enquiry page.
CREATE TABLE IF NOT EXISTS enquiries (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, mobile TEXT NOT NULL, cls TEXT NOT NULL, board TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS enquiries_time ON enquiries(created_at);
-- What a logged-in student opens. kind: 'view' (a page) or 'pdf' (a PDF button); target: the address, such as /class-10/real-numbers.
-- Read by the student's dashboard, the parent's dashboard and the owner's dashboard.
CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, kind TEXT NOT NULL, target TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS events_user ON events(user_id, created_at);
CREATE INDEX IF NOT EXISTS events_time ON events(created_at);
-- Tests made on the Practice page. items: JSON list of { ch, label, n, c } (questions asked and right, for each chapter).
CREATE TABLE IF NOT EXISTS practice_results (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, cls TEXT NOT NULL, level TEXT NOT NULL, score INTEGER NOT NULL, total INTEGER NOT NULL,
  secs INTEGER NOT NULL DEFAULT 0, minutes INTEGER NOT NULL DEFAULT 0, skipped INTEGER NOT NULL DEFAULT 0, items TEXT NOT NULL, taken_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS practice_user ON practice_results(user_id, taken_at);
-- A parent who has entered the student's mobile number and parent code gets one of these sessions (cookie ms_parent).
CREATE TABLE IF NOT EXISTS parent_sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at INTEGER NOT NULL);
-- One row for each AI report, to keep the number per student per day limited.
CREATE TABLE IF NOT EXISTS ai_reports (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS ai_reports_user ON ai_reports(user_id, created_at);
-- A doubt solved on the teacher's whiteboard: pen strokes with times (JSON) and, optionally, the voice in chunks of base64 text.
CREATE TABLE IF NOT EXISTS solutions (doubt_id INTEGER PRIMARY KEY, teacher_id INTEGER NOT NULL, strokes TEXT NOT NULL, duration_ms INTEGER NOT NULL DEFAULT 0,
  audio_mime TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS solution_audio (doubt_id INTEGER NOT NULL, seq INTEGER NOT NULL, data TEXT NOT NULL, PRIMARY KEY (doubt_id, seq));
CREATE INDEX IF NOT EXISTS doubts_unseen ON doubts(user_id, answered_at, seen_at);
