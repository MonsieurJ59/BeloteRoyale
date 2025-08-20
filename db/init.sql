CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  prelim_points INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  round VARCHAR(20) NOT NULL, -- "preliminaire" ou "principal"
  team_a_id INT NOT NULL REFERENCES teams(id),
  team_b_id INT NOT NULL REFERENCES teams(id),
  score_a INT DEFAULT 0,
  score_b INT DEFAULT 0,
  winner_id INT REFERENCES teams(id)
);
