import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GamePageComponent from "../components/GamePage/GamePage";
import ProtectedRoute from "../routes/ProtectedRoute";
import styles from "../styles/GamePage/GamePage.module.css";

export default function GamePage() {
  const [gameId, setGameId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get game ID from localStorage
    const id = localStorage.getItem("gameId");
    if (!id) {
      alert("No active game found");
      navigate("/");
      return;
    }

    setGameId(id);
  }, [navigate]);

  return (
    <ProtectedRoute>
      {gameId && (
        <div className={styles.gameCodeContainer}>
          <div className={styles.gameCodeBox}>
            Game Code: <span className={styles.gameCode}>{gameId}</span>
            <button
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(gameId);
                alert("Game code copied to clipboard!");
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
      <GamePageComponent />
    </ProtectedRoute>
  );
}
