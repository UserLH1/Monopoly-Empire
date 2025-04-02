import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "../styles/HomePage.module.css";

type CreatedGameDetails = {
  status: number;
  message: string;
  data: {
    idJoc: number;
  };
};

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // For Join Game modal
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [gameCode, setGameCode] = useState("");

  // For Create Game modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [playerCount, setPlayerCount] = useState(3);
  const [username, setUsername] = useState(user?.name || "");

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  // Show the create game modal
  const handleCreateGameClick = () => {
    if (!user?.name) {
      alert("Please log in first to create a game.");
      navigate("/login");
      return;
    }

    setUsername(user.name);
    setCreateModalOpen(true);
  };

  // Submit the create game request
  async function handleCreateGameSubmit() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication required. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/jocuri", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          numarJucatori: playerCount,
          username: username,
        }),
      });

      const data: CreatedGameDetails = await response.json();
      console.log("Game created:", data);

      if (!response.ok) {
        throw new Error(data.message || "Could not create game");
      }

      // Save the game ID in localStorage
      localStorage.setItem("gameId", data.data.idJoc.toString());

      // Close modal and redirect to game page
      setCreateModalOpen(false);
      navigate("/game");
    } catch (error: any) {
      alert(error.message);
    }
  }

  const handleJoinGame = () => {
    if (!user?.name) {
      alert("Please log in first to join a game.");
      navigate("/login");
      return;
    }
    setJoinModalOpen(true);
  };

  async function handleJoinSubmit() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication required. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/jocuri/alaturareJoc",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cod: gameCode,
            username: user?.name,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join game");
      }

      // Save the game code in localStorage
      localStorage.setItem("gameId", gameCode);

      // Navigate to the game page
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
          <button className={styles.playButton} onClick={handleCreateGameClick}>
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

      {/* Create Game Modal */}
      {createModalOpen && (
        <div className={styles.modalOverlay}>
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <h2 className={styles.h2_color}>Create New Game</h2>

            <div className={styles.formGroup}>
              <label htmlFor="username">Your Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                readOnly
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="playerCount">Number of Players</label>
              <select
                id="playerCount"
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value))}
              >
                <option value={2}>2 Players</option>
                <option value={3}>3 Players</option>
                <option value={4}>4 Players</option>
              </select>
            </div>

            <div className={styles.modalButtons}>
              <button onClick={handleCreateGameSubmit}>Create Game</button>
              <button onClick={() => setCreateModalOpen(false)}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Join Game Modal */}
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
