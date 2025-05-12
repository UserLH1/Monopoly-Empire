import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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

type Game = {
  idJoc: number;
  nrJucatori: number;
  statusJoc: string;
  jucatori: string; // numele jucătorilor despărțite prin ;
};

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);
  const [currentGameCode, setCurrentGameCode] = useState<string | null>(null);

  // For Join Game modal
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [gameCode, setGameCode] = useState("");

  // For Create Game modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [playerCount, setPlayerCount] = useState(3);
  const [username, setUsername] = useState(user?.name || "");

  // Check if user is in a game
  useEffect(() => {
    checkCurrentGameFromServer();
  }, []);

  const checkCurrentGameFromServer = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      console.log("Nu există token sau utilizator, nu se face cererea");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8080/api/jocuri/jocCurent", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        
      if (!response.ok) {
        if (response.status === 401) {
          // Problema cu autentificarea
          logout();
          return;
        }
        throw new Error("Failed to check current game");
      }
      
      const result = await response.json();
        
      if (result.data && result.data.joc) {
        // Utilizatorul are un joc în curs
        const gameCode = result.data.gameCode.toString();
        const gameId = result.data.joc.idJoc;
        
        // Actualizează starea și localStorage
        setCurrentGameId(gameId);
        setCurrentGameCode(gameCode);
        localStorage.setItem("gameId", gameCode);
      } else {
        // Utilizatorul nu are un joc în curs, curăță localStorage
        localStorage.removeItem("gameId");
        setCurrentGameId(null);
        setCurrentGameCode(null);
      }
    } catch (error) {
      console.error("Error checking current game:", error);
    }
  };

  const checkCurrentGame = () => {
    // Citește din localStorage doar pentru compatibilitate înapoi
    // dar datele adevărate vor veni de la server prin checkCurrentGameFromServer
    const storedGameId = localStorage.getItem("gameId");
    if (storedGameId) {
      setCurrentGameId(Number(storedGameId) - 1000);
      setCurrentGameCode(storedGameId);
    } else {
      setCurrentGameId(null);
      setCurrentGameCode(null);
    }
    
    // Verifică și cu serverul pentru date actualizate
    checkCurrentGameFromServer();
  };

  // Exit game function
  const handleExitGame = async () => {
    if (!currentGameId) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required");
      return;
    }
    
    if (window.confirm("Are you sure you want to exit this game?")) {
      try {
        const response = await fetch(`http://localhost:8080/api/jocuri/parasireJoc/${currentGameId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to exit game");
        }
        
        // Clear game ID from local storage
        localStorage.removeItem("gameId");
        setCurrentGameId(null);
        setCurrentGameCode(null);
        
      } catch (error: any) {
        alert(error.message);
        console.error("Error exiting game:", error);
      }
    }
  };

  const handleJoinCurrentGame = () => {
    navigate("/pending");
  };

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

      // Save the game ID (+1000 for game code) in localStorage
      const gameCode = (data.data.idJoc + 1000).toString();
      localStorage.setItem("gameId", gameCode);

      // Close modal and redirect to game page
      setCreateModalOpen(false);
      navigate("/pending");

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
    
    // Show modal to enter game code manually
    setJoinModalOpen(true);
  };

  const joinGame = async (gameCode: string) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Authentication required. Please login again.");
      navigate("/login");
      return;
    }
  
    try {
      // transformăm codul de la utilizator în id real
      const realGameId = Number(gameCode) - 1000;
  
      const response = await fetch( 
        `http://localhost:8080/api/jocuri/alaturareJoc/${realGameId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join game");
      }
  
      // Salvăm în localStorage codul pe care l-a introdus userul
      localStorage.setItem("gameId", gameCode);
  
      setJoinModalOpen(false);
      setGameCode("");
  
      navigate("/pending");
    } catch (error: any) {
      // Aici afișăm mesajul personalizat de eroare
      alert(error.message);
      console.error("Error joining game:", error);
    }
  };
  
  async function handleJoinSubmit() {
    joinGame(gameCode);
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
            Join New Game
          </button>
          
          {/* Afișează butonul pentru jocul curent doar dacă există unul */}
          {currentGameId !== null && (
            <div className={styles.currentGameSection}>
              <button className={`${styles.playButton} ${styles.continueButton}`} onClick={handleJoinCurrentGame}>
                Continue Game #{currentGameCode}
              </button>
              <button className={`${styles.playButton} ${styles.exitButton}`} onClick={handleExitGame}>
                Exit Current Game
              </button>
            </div>
          )}
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
