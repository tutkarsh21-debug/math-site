-- Teachers can ask for an account on the Login page; the owner approves them at /admin/teachers. Only adds a column.
-- Run once on the live database and on any local copy.
ALTER TABLE users ADD COLUMN teacher_request INTEGER NOT NULL DEFAULT 0;   -- 1 while a teacher request waits for the owner
