//// filepath: c:\My Files\Facultate\PW\client\src\pages\HomePage.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "../styles/HomePage.module.css";

type CreatedGameDetails = {
  code: string;
  creator: string;
  createdAt: string;
  numarJucatori: number;
  message?: string; // in case the API returns some success message
};

export default function HomePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [gameCode, setGameCode] = useState("");

  // New states for the "Create Game" flow
  const [createGameModalOpen, setCreateGameModalOpen] = useState(false);
  const [createdGame, setCreatedGame] = useState<CreatedGameDetails | null>(
    null
  );

  const handleLogin = () => {
    navigate("/login");
  };
  const handleRegister = () => {
    navigate("/register");
  };

  // Modified: calls the API, then shows a new popup with details
  async function handleCreateGame() {
    if (!user?.name) {
      alert("Please log in first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/joc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Attach the token in the Authorization header
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          numarJucatori: 3,
          username: user.name,
        }),
      });
      const data: CreatedGameDetails = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create game");
      }

      // Save the returned data (includes game code, date, etc.)
      setCreatedGame(data);
      setCreateGameModalOpen(true);
    } catch (error: any) {
      alert(error.message);
    }
  }

  const handleJoinGame = () => {
    setJoinModalOpen(true);
  };

  async function handleJoinSubmit() {
    if (!user?.name) {
      alert("Please log in first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/joc/alaturareJoc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cod: gameCode, username: user.name }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join game");
      }
      navigate("/game");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setJoinModalOpen(false);
      setGameCode("");
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Monopoly Empire</h1>
        {user ? (
          <div className={styles.userPanel}>
            <span>Welcome, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className={styles.buttonGroup}>
            <button onClick={handleLogin} className={styles.loginButton}>
              Login
            </button>
            <button onClick={handleRegister} className={styles.loginButton}>
              Register
            </button>
          </div>
        )}
      </header>

      <main className={styles.mainContent}>
        <section className={styles.quickStart}>
          <h2>Quick Start</h2>
          {/* On create, call handleCreateGame */}
          <button className={styles.playButton} onClick={handleCreateGame}>
            Create Private Game
          </button>
          <button className={styles.playButton} onClick={handleJoinGame}>
            Join Game
          </button>
        </section>

        <section className={styles.stats}>
          <h3>Your Statistics</h3>
          <div className={styles.statsGrid}>
            <StatItem title="Games Played" value="0" />
            <StatItem title="Wins" value="0" />
          </div>
        </section>
      </main>

      {/* Modal for "Join Game" */}
      {joinModalOpen && (
        <div className={styles.modalOverlay}>
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <h2 className={styles.h2_color}>Enter Game Code</h2>
            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              placeholder="Game Code"
            />
            <div className={styles.modalButtons}>
              <button onClick={handleJoinSubmit}>Join</button>
              <button onClick={() => setJoinModalOpen(false)}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal for "Game Created" details */}
      {createGameModalOpen && createdGame && (
        <div className={styles.modalOverlay}>
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <h2 className={styles.h2_color}>Game Created!</h2>
            <p>
              <strong>Creator:</strong> {createdGame.creator}
            </p>
            <p>
              <strong>Created At:</strong> {createdGame.createdAt}
            </p>
            <p>
              <strong>Number of Players:</strong> {createdGame.numarJucatori}
            </p>
            <p>
              <strong>Game Code:</strong> {createdGame.code}
            </p>

            <div className={styles.modalButtons}>
              <button onClick={() => setCreateGameModalOpen(false)}>OK</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function StatItem({ title, value }: { title: string; value: string }) {
  return (
    <div className={styles.statItem}>
      <span className={styles.statTitle}>{title}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}
