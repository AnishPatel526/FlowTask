-- SQL schema for collaborative task planner

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP,
  priority INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE
);