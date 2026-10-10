-- Weekly timetable: classes that repeat every week, and cancelling or moving a single day's class. Only adds columns.
-- Run once on the live database and on any local copy.
ALTER TABLE timetable ADD COLUMN series TEXT NOT NULL DEFAULT '';      -- classes made together with "repeat every week" share this
ALTER TABLE timetable ADD COLUMN status TEXT NOT NULL DEFAULT '';      -- '' or 'cancelled'
ALTER TABLE timetable ADD COLUMN reason TEXT NOT NULL DEFAULT '';      -- why a class was cancelled (shown to students)
ALTER TABLE timetable ADD COLUMN moved INTEGER NOT NULL DEFAULT 0;     -- 1 if the class was moved to another time
CREATE INDEX IF NOT EXISTS timetable_series ON timetable(series, starts_at);
