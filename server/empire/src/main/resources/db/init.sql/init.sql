
-- First clear existing data if needed
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE panou_cumparat;
TRUNCATE TABLE card;
TRUNCATE TABLE panou;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert brands (panouri) based on the provided data - now including logo column
INSERT INTO panou (id_panou, nume, pret, valoare_adaugata_turn, pozitia_tabla_joc, culoare, logo) VALUES
(1, 'Nerf', 50, 50, 2, '#ff8800', '/assets/brands/nerf.png'),
(2, 'Transformers', 50, 50, 4, '#ff8800', '/assets/brands/transformers.png'),
(3, 'Yahoo', 150, 50, 6, '#eb1a1a', '/assets/brands/yahoo.png'),
(4, 'Under Armour', 150, 50, 7, '#eb1a1a', '/assets/brands/underarmour.png'),
(5, 'Levis', 150, 50, 8, '#eb1a1a', '/assets/brands/levis.png'),
(6, 'Polaroid', 200, 100, 10, '#00ACEE', '/assets/brands/polaroid.png'),
(7, 'Puma', 200, 100, 11, '#00ACEE', '/assets/brands/puma.png'),
(8, 'Candy Crush', 200, 100, 12, '#00ACEE', '/assets/brands/candy.png'),
(9, 'JetBlue', 250, 100, 14, '#057396', '/assets/brands/jetblue.png'),
(10, 'Skype', 250, 100, 15, '#057396', '/assets/brands/skype.png'),
(11, 'Spotify', 250, 100, 16, '#057396', '/assets/brands/spotify.png'),
(12, 'Ducati', 250, 150, 18, '#f5f5f5', '/assets/brands/ducati.png'),
(13, 'CocaCola', 250, 150, 19, '#f5f5f5', 'assets/brands/cocacola.png'),
(14, 'Intel', 250, 150, 20, '#f5f5f5', '/assets/brands/intel.png'),
(15, 'Samsung', 300, 150, 22, '#3ba1da', '/assets/brands/samsung.png'),
(16, 'McDonald''s', 300, 150, 23, '#3ba1da', '/assets/brands/mcdonalds.png'),
(17, 'Netflix', 300, 150, 24, '#3ba1da', '/assets/brands/netflix.png'),
(18, 'Nestle', 350, 200, 26, '#9417ff', '/assets/brands/nestle.png'),
(19, 'Xbox', 350, 200, 27, '#9417ff', '/assets/brands/xbox.png'),
(20, 'Ebay', 350, 200, 29, '#9417ff', '/assets/brands/ebay.png'),
(21, 'Amazon', 400, 200, 31, '#2217ff', '/assets/brands/amazon.png'),
(22, 'Universal', 400, 200, 32, '#2217ff', '/assets/brands/universal.png');

-- Insert cards based on the provided data
-- Card type: 0 = chance cards, 1 = empire cards
INSERT INTO card (id_card, card_type, descriere, titlu, active_cards) VALUES
(1, 0, 'Mergi la inchisoare! Nu primesti valoarea de pe turn.', 'Esti arestat!', 'active_cards'),
(2, 0, 'Mergi 2 spatii inainte', 'Inainteaza cu stil!', 'active_cards'),
(3, 0, 'Mergi la start si primesti valoarea de pe turn', 'Plimbare cu limuzina ta privata', 'active_cards'),
(4, 0, 'Primesti 100 de la banca.', 'Este ziua ta!', 'active_cards'),
(5, 0, 'Primesti 50 de la banca', 'Felicitari!', 'active_cards'),
(6, 1, 'Primeste de 2 ori suma de pe turnul tau.', 'Felicitari!', 'active_cards'),
(7, 1, 'Primesti 200 de la banca', 'Ai fost recompensat!', 'active_cards'),
(8, 1, 'Mergi 5 pasi inapoi. Daca treci pe langa start nu primesti banii', 'Pas cu pas', 'active_cards'),
(9, 1, 'Returneaza pe tabla de joc de mai scump panou din turnul tau.', 'Esti penalizat!', 'active_cards'),
(10, 1, 'Retruneaza pe tabla de joc cel mai ieftin panou din turnul tau', 'Esti penalizat!', 'active_cards');

-- Insert sample users/players
INSERT INTO utilizator (id_utilizator, username, parola, email, rol, suma_bani, id_joc, pozitie) VALUES
(1, 'player1', '$2a$10$wvN9vQhT3QsZshBuQf0NTepWZUFOOLjW4TG0WvQC8g3d7DP1JgeDe', 'player1@example.com', 'PLAYER', 1500, 1, 1),
(2, 'player2', '$2a$10$wvN9vQhT3QsZshBuQf0NTepWZUFOOLjW4TG0WvQC8g3d7DP1JgeDe', 'player2@example.com', 'PLAYER', 1500, 1, 5);

-- Insert sample games
INSERT INTO joc (id_joc, status_joc, numar_jucatori, durata) VALUES
(1, 'IN_PROGRESS', 2, 0);

-- Insert towers for players
INSERT INTO turn (id_turn, username, valoare_turn) VALUES
(1, 'player1', 0),
(2, 'player2', 0);