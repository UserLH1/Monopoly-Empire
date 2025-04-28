import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/GameSetupPage.module.css";

export default function GameSetupPage() {
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(2);
  const [gameName, setGameName] = useState("");

  const handleStartGame = () => {
    navigate("/pending");
  };

  return (
    <div className={styles.container}>
      <h1>Game Setup</h1>

      <div className={styles.setupForm}>
        <div className={styles.formGroup}>
          <label htmlFor="gameName">Game Name</label>
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="My Monopoly Game"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="playerCount">Number of Players</label>
          <select
            id="playerCount"
            value={playerCount}
            onChange={(e) => setPlayerCount(Number(e.target.value))}
          >
            {[2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num} Players
              </option>
            ))}
          </select>
        </div>

        <button
          className={styles.startButton}
          onClick={handleStartGame}
          disabled={!gameName.trim()}
        >
          Start Game
        </button>

        <button className={styles.cancelButton} onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
