DROP DATABASE IF EXISTS connect4;
CREATE DATABASE connect4;

\c connect4;

CREATE TABLE players (
  player_id SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  password VARCHAR(45) NOT NULL,
  totalWin INT NOT NULL DEFAULT 0
);

CREATE TABLE games (
  game_id SERIAL NOT NULL,
  game_name VARCHAR(45),
  player1_id INT NOT NULL,
  player2_id INT,
  game_full BOOLEAN DEFAULT false,
  
  CONSTRAINT player_id_FK FOREIGN KEY (player1_id)
     REFERENCES players (player_id)
     ON DELETE CASCADE ON UPDATE CASCADE
);

-- example players --
INSERT INTO players (name, email, password, totalWin)
  VALUES ('Bob', 'bob@gmail.com', '123', 5);

INSERT INTO players (name, email, password, totalWin)
  VALUES ('Max', 'max@gmail.com', '1234', 2);
