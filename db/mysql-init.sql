CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  player1 VARCHAR(255) NOT NULL,
  player2 VARCHAR(255) NOT NULL,
  prelim_points INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  is_prelim BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = préliminaires, FALSE = principal
  team_a_id INT NOT NULL,
  team_b_id INT NOT NULL,
  score_a INT DEFAULT 0,
  score_b INT DEFAULT 0,
  winner_id INT,
  FOREIGN KEY (team_a_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (team_b_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (winner_id) REFERENCES teams(id) ON DELETE SET NULL
);
