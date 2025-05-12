import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Player = {
  username: string;
  nrJocuriCastigate: number;
};

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/jucatori", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch players.");
        }

        const data = await response.json();
        setPlayers(data.data); // presupunem că răspunsul are field-ul `data`
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div style={{ padding: "40px", backgroundColor: "#0a2540", color: "white", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>Leaderboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ margin: "40px auto", width: "80%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid white", paddingBottom: "10px" }}>Username</th>
            <th style={{ borderBottom: "2px solid white", paddingBottom: "10px" }}>Games Won</th>
          </tr>
        </thead>
        <tbody>
          {players.length === 0 ? (
            <tr>
              <td colSpan={2} style={{ textAlign: "center", padding: "20px" }}>No players found.</td>
            </tr>
          ) : (
            players
              .sort((a, b) => b.nrJocuriCastigate - a.nrJocuriCastigate) // sort descending by wins
              .map((player, index) => (
                <tr key={index}>
                  <td style={{ padding: "10px", textAlign: "center" }}>{player.username}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>{player.nrJocuriCastigate}</td>
                </tr>
              ))
          )}
        </tbody>
      </table>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            backgroundColor: "#d9534f",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
