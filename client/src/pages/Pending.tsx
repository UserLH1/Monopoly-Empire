import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/PendingPage.css";

type JocDto = {
  jucatori: string;    // numele jucătorilor despărțite prin virgulă
  nrJucatori: number;  // numărul total de jucători necesari
  statusJoc: string;   // statusul jocului (ex: "WAITING" sau "STARTED")
  idJoc: number;       // id-ul jocului
};

export default function PendingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const gameId = localStorage.getItem("gameId");

  useEffect(() => {
    if (!gameId) {
      setError("No game ID found. Please rejoin the game.");
      return;
    }

    const fetchGameData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8080/api/jocuri`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch game data.");
        }

        const data: { data: JocDto[] } = await response.json(); // presupunem răspunsul are field-ul "data"

        // Găsim jocul cu id-ul nostru
        const myGame = data.data.find((game) => (game.idJoc + 1000).toString() === gameId);


        if (!myGame) {
          throw new Error("Game not found.");
        }

        // Extragem lista de jucători
        const playerList = myGame.jucatori ? myGame.jucatori.split(",") : [];
        setPlayers(playerList);

        // Verificăm dacă jocul a început (opțional)
        if (myGame.statusJoc === "STARTED") {
          navigate("/game");
        }

        // Sau pornim automat când sunt suficienți jucători
        if (playerList.length === myGame.nrJucatori) {
          setTimeout(() => {
            navigate("/game");
          }, 1000);
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
        <div className="left-side">
          <div className="welcome">Waiting for Players...</div>

          {gameId && (
            <div className="game-id">
              <strong>Game ID:</strong> {gameId}
            </div>
          )}

          <div className="image-placeholder">
            Loading players...
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
