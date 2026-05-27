CREATE TABLE t_p56151072_missing_persons_site.users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   VARCHAR(255) NOT NULL,
  login       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20)  NOT NULL CHECK (role IN ('admin', 'inspector', 'officer')),
  department  VARCHAR(255) NOT NULL DEFAULT '',
  rank        VARCHAR(100),
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);