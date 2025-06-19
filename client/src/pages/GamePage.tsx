import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GamePageComponent from "../components/GamePage/GamePageComponent";
import ProtectedRoute from "../routes/ProtectedRoute";
import styles from "../styles/GamePage/GamePage.module.css";
import useAuth from "../hooks/useAuth";

// Funcția de formatare a timpului
const formatGameTime = (seconds: number | null): string => {
  if (seconds === null) return "00:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

export default function GamePage() {
  const [gameId, setGameId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State pentru timer
  const [gameTime, setGameTime] = useState<number | null>(null);
  const [localGameTime, setLocalGameTime] = useState<number | null>(null);
  const [timerUpdated, setTimerUpdated] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);

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

  // Sincronizarea cu backend-ul la fiecare 30 secunde
  useEffect(() => {
    // Fetch game time for initial sync
    fetchGameTime(); 
    
    const syncInterval = setInterval(() => {
      if (gameId) {
        fetchGameTime();
      }
    }, 30000); // Sincronizare la fiecare 30 secunde
    
    return () => clearInterval(syncInterval);
  }, [gameId]);

  // Timer local care actualizează în fiecare secundă
  useEffect(() => {
    // Actualizează timer-ul local în fiecare secundă dacă avem un timp inițial
    if (gameTime !== null) {
      // La prima sincronizare, setează și timpul local
      if (localGameTime === null) {
        setLocalGameTime(gameTime);
      }
      
      const timerInterval = setInterval(() => {
        setLocalGameTime(prev => prev !== null ? prev + 1 : null);
      }, 1000);
      
      return () => clearInterval(timerInterval);
    }
  }, [gameTime]);

  const fetchGameTime = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!gameId) return;
      const realGameId = Number(gameId) - 1000;
      
      const response = await fetch(`http://localhost:8080/api/jocuri/${realGameId}/timp`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (gameTime !== result.data) {
          setGameTime(result.data);
          setLocalGameTime(result.data); // Resetează timpul local la timpul de pe server
          setLastSyncTime(Date.now());
          
          // Activează animația de highlight
          setTimerUpdated(true);
          setTimeout(() => setTimerUpdated(false), 1000);
        }
      }
    } catch (error) {
      console.error("Error fetching game time:", error);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleExitGame = async () => {
    if (!gameId) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required");
      return;
    }
    
    if (window.confirm("Are you sure you want to exit this game? You will lose your progress.")) {
      try {
        const realGameId = Number(gameId) - 1000;
        const response = await fetch(`http://localhost:8080/api/jocuri/parasireJoc/${realGameId}`, {
          method: "PUT",
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
        navigate("/");
        
      } catch (error: any) {
        alert(error.message);
        console.error("Error exiting game:", error);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.gamePageWrapper}>
        {/* Header îmbunătățit cu timer central */}
        <div className={styles.mainHeader}>
          <div className={styles.controlsSection}>
            {gameId && (
              <div className={styles.gameControls}>
                <button 
                  className={styles.backButton}
                  onClick={handleBackToHome}
                >
                  Back to Home
                </button>
                <button 
                  className={styles.exitButton}
                  onClick={handleExitGame}
                >
                  Exit Game
                </button>
              </div>
            )}
          </div>

          <div className={styles.timerSection}>
            <motion.div 
              className={styles.gameTimer}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className={styles.timerLabel}>Game Time</div>
              <div className={`${styles.timerValue} ${timerUpdated ? styles.updated : ''}`}>
                {formatGameTime(localGameTime)}
              </div>
            </motion.div>
          </div>

          <div className={styles.gameInfoSection}>
            <div className={styles.gameCodeDisplay}>
              Game #{gameId}
            </div>
          </div>
        </div>

        {/* Componenta principală a jocului */}
        <GamePageComponent syncedTime={gameTime} />
      </div>
    </ProtectedRoute>
  );
}
