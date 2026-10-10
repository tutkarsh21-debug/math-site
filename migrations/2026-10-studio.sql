-- Studios: the timetable (live classes and 1-to-1 classes) and the YouTube playlists of the recorded studio. Only adds tables.
-- Run once on the live database and on any local copy.
CREATE TABLE IF NOT EXISTS timetable (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,                       -- 'live' (for a class) or 'one' (1-to-1, for one student)
  title TEXT NOT NULL,
  cls TEXT NOT NULL DEFAULT '',             -- live: 'class-10', or '' for every class
  board TEXT NOT NULL DEFAULT '',           -- live: 'CBSE' or 'ICSE', or '' for both
  student_id INTEGER NOT NULL DEFAULT 0,    -- one: the student's user id
  starts_at INTEGER NOT NULL,               -- unix seconds
  minutes INTEGER NOT NULL DEFAULT 60,
  link TEXT NOT NULL DEFAULT '',            -- live: the YouTube video id of this stream; one: an optional meeting link (Meet, Zoom)
  notes TEXT NOT NULL DEFAULT '',
  room TEXT NOT NULL DEFAULT '',            -- one: the secret name of the video room
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS timetable_time ON timetable(starts_at);
CREATE INDEX IF NOT EXISTS timetable_student ON timetable(student_id, starts_at);
CREATE TABLE IF NOT EXISTS studio_playlists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cls TEXT NOT NULL DEFAULT '',             -- 'class-9', or '' for every class
  title TEXT NOT NULL,
  playlist TEXT NOT NULL,                   -- the YouTube playlist id
  created_at INTEGER NOT NULL
);
