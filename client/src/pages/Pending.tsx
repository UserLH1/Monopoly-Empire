import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/PendingPage.css";

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
  const [showToast, setShowToast] = useState(false); // 👈 adăugat pentru mesaj toast

  const gameId = localStorage.getItem("gameId");

  useEffect(() => {
    if (!gameId) {
      setError("No game ID found. Please rejoin the game.");
      return;
    }

    const fetchGameData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8080/api/jocuri/${gameId}`, {
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

        const playerList = myGame.jucatori ? myGame.jucatori.split(";") : [];
        setPlayers(playerList);

        if (myGame.statusJoc === "STARTED") {
          navigate("/game");
        } else if (playerList.length === myGame.nrJucatori && myGame.statusJoc === "WAITING") {
          // Arată toast alert înainte de navigate
          setShowToast(true);
          setTimeout(() => {
            navigate("/game");
          }, 1500);
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchGameData();
    const intervalId = setInterval(fetchGameData, 3000);

    return () => clearInterval(intervalId);
  }, [gameId, navigate]);

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="title">Monopoly Empire</div>
        {user && (
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        )}
      </nav>

      <main className="main-section">
        {showToast && ( // 👈 Toast alert
          <div style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            zIndex: 1000
          }}>
            All players have joined! Starting game...
          </div>
        )}

        <div className="left-side">
          <div className="welcome">Waiting for Players...</div>

          {gameId && (
            <div className="game-id">
              <strong>Game ID:</strong> {gameId}
            </div>
          )}

          <div className="image-placeholder">
            {players.length === 0 ? "Loading players..." : null}
          </div>

          <div className="description">
            Share the Game ID with your friends! As soon as enough players join, the game will begin automatically.
          </div>
        </div>

        <div className="right-side">
          <div className="players-title">Players Joined</div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <ul className="players-list">
            {players.length === 0 ? (
              <p>No players yet.</p>
            ) : (
              players.map((player, index) => (
                <li key={index} className="player">
                  <div className="avatar">{player.charAt(0).toUpperCase()}</div>
                  <div>{player}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>

      <footer className="footer">
        &copy; 2025 Monopoly Empire. All rights reserved.
      </footer>
    </div>
  );
}
