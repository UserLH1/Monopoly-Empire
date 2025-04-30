import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "../styles/PendingPage.module.css";
import { motion } from "framer-motion";

type JocDto = {
  jucatori: string;    // numele jucătorilor despărțite prin ;
  nrJucatori: number;  // numărul total de jucători necesari
  statusJoc: string;   // statusul jocului (ex: "WAITING" sau "STARTED")
  idJoc: number;       // id-ul jocului
};

export default function PendingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [gameInfo, setGameInfo] = useState<JocDto | null>(null);
  const [isAllPlayersJoined, setIsAllPlayersJoined] = useState(false);

  const gameCode = localStorage.getItem("gameId");

  useEffect(() => {
    if (!gameCode) {
      setError("No game ID found. Please rejoin the game.");
      return;
    }

    const fetchGameData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Transformăm codul jocului în ID-ul real pentru API
        const realGameId = Number(gameCode) - 1000;

        const response = await fetch(`http://localhost:8080/api/jocuri/${realGameId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch game data.");
        }

        const data: { data: JocDto } = await response.json();
        const myGame = data.data;

        if (!myGame) {
          throw new Error("Game not found.");
        }

        setGameInfo(myGame);
        const playerList = myGame.jucatori ? myGame.jucatori.split(";") : [];
        setPlayers(playerList);

        // Verifică dacă toți jucătorii au intrat
        setIsAllPlayersJoined(playerList.length === myGame.nrJucatori);

        if (myGame.statusJoc === "STARTED") {
          navigate("/game");
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchGameData();
    const intervalId = setInterval(fetchGameData, 3000);

    return () => clearInterval(intervalId);
  }, [gameCode, navigate]);

  const handleStartGame = async () => {
    // Implementează logica pentru a începe jocul
    try {
      const token = localStorage.getItem("token");
      const realGameId = Number(gameCode) - 1000;
      
      // Trebuie să existe un endpoint de start game
      
      // Redirecționează către pagina de joc
      navigate("/game");
      
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

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
            <button onClick={() => navigate("/login")} className={styles.loginButton}>
              Login
            </button>
          </div>
        )}
      </header>

      <main className={styles.mainContent}>
        <section className={styles.quickStart}>
          <h2>Waiting for Players</h2>
          
          {gameCode && (
            <div className={styles.gameCodeDisplay}>
              <span>Game Code:</span>
              <span className={styles.codeNumber}>{gameCode}</span>
            </div>
          )}
          
          <p className={styles.instructions}>
            Share this code with your friends to join the game. The game will start once all players have joined.
          </p>
          
          {isAllPlayersJoined && (
            <button 
              className={`${styles.playButton} ${styles.startButton}`}
              onClick={handleStartGame}
            >
              Start Game
            </button>
          )}
          
          <button 
            className={`${styles.playButton} ${styles.backButton}`}
            onClick={handleBack}
          >
            Back to Home
          </button>
        </section>

        <section className={styles.playersList}>
          <h3>Players Joined ({players.length}/{gameInfo?.nrJucatori || "?"})</h3>
          
          {players.length === 0 ? (
            <div className={styles.noPlayers}>No players have joined yet</div>
          ) : (
            <ul className={styles.playersGrid}>
              {players.map((player, index) => (
                <motion.li 
                  key={index} 
                  className={styles.playerCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.playerAvatar}>
                    {player.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.playerName}>{player}</div>
                </motion.li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Toast pentru afișarea mesajelor */}
      {showToast && (
        <motion.div 
          className={styles.toast}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          All players have joined! You can start the game now.
        </motion.div>
      )}
    </div>
  );
}
