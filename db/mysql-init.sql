CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  player1 VARCHAR(255) NOT NULL,
  player2 VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  status ENUM('upcoming', 'in_progress', 'completed') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_tournament_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  tournament_id INT NOT NULL,
  prelim_points INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  UNIQUE KEY unique_team_tournament (team_id, tournament_id)
);

CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  is_prelim BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = préliminaires, FALSE = principal
  team_a_id INT NOT NULL,
  team_b_id INT NOT NULL,
  score_a INT DEFAULT 0,
  score_b INT DEFAULT 0,
  winner_id INT,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (team_a_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (team_b_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (winner_id) REFERENCES teams(id) ON DELETE SET NULL
);
