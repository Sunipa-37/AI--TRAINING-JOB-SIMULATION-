-- ============================================================
-- Trainly — DB schema
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(160) NOT NULL,
  email         VARCHAR(160) UNIQUE NOT NULL,
  phone         VARCHAR(20),
  school        VARCHAR(160),
  board         VARCHAR(40),
  class_level   SMALLINT,
  age           SMALLINT CHECK (age IS NULL OR age > 6),
  password_hash VARCHAR(200),               -- null for Google-only accounts
  auth_provider VARCHAR(20) NOT NULL DEFAULT 'local', -- local | google
  avatar_url    TEXT,
  theme         VARCHAR(10) NOT NULL DEFAULT 'light', -- light | dark
  is_admin      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id                SERIAL PRIMARY KEY,
  code              VARCHAR(20) UNIQUE NOT NULL,
  company           VARCHAR(200) NOT NULL,
  trust_badge       VARCHAR(60),               -- e.g. "Verified Partner"
  category          VARCHAR(60) NOT NULL,      -- AI topic, used for filtering
  location          VARCHAR(120) NOT NULL,
  remote            BOOLEAN NOT NULL DEFAULT true,
  title             VARCHAR(160) NOT NULL,
  description       TEXT NOT NULL,
  pay_range         VARCHAR(60) NOT NULL,
  tags              TEXT[] NOT NULL DEFAULT '{}',
  applicants_count  INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id            SERIAL PRIMARY KEY,
  category      VARCHAR(40) NOT NULL,            -- Maths / Science / SST / Conceptual / Descriptive
  prompt        TEXT NOT NULL,
  options       JSONB NOT NULL,
  correct_index SMALLINT NOT NULL,                -- never sent to the client
  sort_order    SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS applications (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id),
  project_id    INTEGER REFERENCES projects(id),
  first_name    VARCHAR(80) NOT NULL,
  last_name     VARCHAR(80) NOT NULL,
  email         VARCHAR(160) NOT NULL,
  school        VARCHAR(160) NOT NULL,
  board         VARCHAR(40) NOT NULL,
  class_level   SMALLINT NOT NULL CHECK (class_level > 6 AND class_level <= 12),
  status        VARCHAR(20) NOT NULL DEFAULT 'applied', -- applied | quiz_completed
  score         SMALLINT,
  percent       NUMERIC(5,2),
  selected      BOOLEAN,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS notifications (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         VARCHAR(160) NOT NULL,
  body          TEXT NOT NULL,
  read          BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_posts (
  id            SERIAL PRIMARY KEY,
  handle        VARCHAR(60) NOT NULL,
  body          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_project ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
