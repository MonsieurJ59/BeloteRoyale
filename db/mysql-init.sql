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

-- Table d'association équipes-tournois (inscriptions)
CREATE TABLE IF NOT EXISTS team_tournament (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  tournament_id INT NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  UNIQUE KEY unique_registration (team_id, tournament_id)
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

CREATE TABLE IF NOT EXISTS tournament_match_configs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  match_type VARCHAR(50) NOT NULL, -- 'preliminaires' ou 'principal_X'
  is_enabled BOOLEAN DEFAULT TRUE,
  max_matches INT DEFAULT 10,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  UNIQUE KEY unique_tournament_match_type (tournament_id, match_type)
);

CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  match_type VARCHAR(50) NOT NULL DEFAULT 'preliminaires', -- 'preliminaires' ou 'principal_X'
  match_order INT DEFAULT 1,
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
