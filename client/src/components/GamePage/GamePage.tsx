import { useState, useEffect } from "react";
import styles from "../../styles/GamePage/GamePage.module.css";
import Bank from "./Bank";
import CardDeck from "./CardDecks";
import DiceArea from "./DiceArea";
import GameBoard from "./GameBoard";
import PlayerPanel from "./PlayerPanels";
import tileData from "../../assets/tiles.json";
import useAuth from "../../hooks/useAuth";

// Definirea tipului pentru tipurile valide de dale
type TileType = "empire" | "chance" | "corner" | "brand" | "utility" | "tax";

// Definirea tipurilor pentru jucători și dale
type Player = {
  id: string;
  name: string;
  color: string;
  money: number;
  position: number;
  properties: any[];
  brands: any[];
  towerHeight: number;
};

type Tile = {
  id: string;
  position: number;
  type: TileType;
  name: string;
  color?: string;
  value?: number;
  logo?: string;
};

// Culori predefinite pentru jucători
const PLAYER_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"];

export default function GamePage() {
  const { user } = useAuth();
  // Inițializare cu un array gol și validare în useEffect
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [bankMoney, setBankMoney] = useState(15000);
  const [gameStatus, setGameStatus] = useState<"waiting" | "playing" | "finished">("waiting");
  
  // Inițializează și validează tiles
  useEffect(() => {
    try {
      // Validează că toate tiles au un tip valid
      const validatedTiles = tileData.tiles.map(tile => {
        // Verifică dacă tipul este valid
        const validType = ["empire", "chance", "corner", "brand", "utility", "tax"].includes(tile.type);
        if (!validType) {
          console.error(`Tip de dale invalid: ${tile.type} pentru ${tile.name}`);
          // Oferă un tip implicit pentru siguranță
          return { ...tile, type: "utility" as TileType };
        }
        return tile as Tile;
      });
      
      setTiles(validatedTiles);
    } catch (error) {
      console.error("Eroare la încărcarea datelor pentru dale:", error);
    }
  }, []);
  
  // Obține informații despre joc și jucători
  useEffect(() => {
    async function fetchGameData() {
      try {
        const token = localStorage.getItem("token");
        const gameId = localStorage.getItem("gameId");
        
        if (!gameId) {
          console.error("No game ID found");
          return;
        }
        
        // Convertește gameId în ID-ul real al jocului
        const realGameId = Number(gameId) - 1000;
        
        // Fetch game data
        const response = await fetch(`http://localhost:8080/api/jocuri/${realGameId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch game data");
        }
        
        const result = await response.json();
        const gameData = result.data;
        
        // Obtine lista de jucători
        const playerNames = gameData.jucatori.split(";");
        
        // Crearea jucătorilor cu nume reale
        const gamePlayers = playerNames.map((name: string, index: number) => ({
          id: `p${index + 1}`,
          name: name.trim(), // Numele real al jucătorului
          color: PLAYER_COLORS[index], // Culoarea predefinită
          money: 1500,
          position: 0,
          properties: [],
          brands: [],
          towerHeight: 0
        }));
        
        setPlayers(gamePlayers);
        setGameStatus("playing");
        
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    }
    
    fetchGameData();
  }, []);

  const handleDiceRoll = (diceValues: number[]) => {
    const diceSum = diceValues[0] + diceValues[1];

    // Move current player token
    setPlayers((prev) => {
      const newPlayers = [...prev];
      const currentPlayer = { ...newPlayers[currentPlayerIndex] };

      // Calculate new position (wrapping around the board)
      currentPlayer.position = (currentPlayer.position + diceSum) % tiles.length;

      newPlayers[currentPlayerIndex] = currentPlayer;
      return newPlayers;
    });

    // Logic for handling landing on different tile types would go here

    // Move to next player after a delay to allow for animations
    setTimeout(() => {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }, 2000);
  };

  const handleDrawCard = (type: "empire" | "chance") => {
    // Logic for handling card drawing
    console.log(`Player drew a ${type} card`);
  };

  // Dacă jocul încă se încarcă sau nu avem jucători, afișează stare de încărcare
  if (gameStatus === "waiting" || players.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <h2>Loading game data...</h2>
      </div>
    );
  }

  // Poziționarea panourilor de jucători în funcție de numărul lor
  const playerPositions = players.length === 2 
    ? ["topLeft", "topRight"] 
    : players.length === 3
    ? ["topLeft", "topRight", "bottomLeft"]
    : ["topLeft", "topRight", "bottomLeft", "bottomRight"];

  return (
    <div className={styles.gamePageContainer}>
      <div className={styles.gameContent}>
        {/* Bank positioned at top center */}
        <div className={styles.topBank}>
          <Bank totalMoney={bankMoney} onTransaction={() => {}} />
        </div>

        {/* Player panels - afișate condițional bazat pe numărul de jucători */}
        {players.map((player, index) => (
          <PlayerPanel
            key={player.id}
            player={player}
            isCurrentPlayer={currentPlayerIndex === index}
            position={playerPositions[index] as "topLeft" | "topRight" | "bottomLeft" | "bottomRight"}
          />
        ))}

        {/* Game board */}
        <div className={styles.boardArea}>
          <GameBoard
            tiles={tiles}
            currentPlayer={currentPlayerIndex}
            players={players}
          />

          {/* Dice moved to center of board */}
          <div className={styles.centerDiceArea}>
            <DiceArea
              onRoll={handleDiceRoll}
              disabled={gameStatus !== "playing"}
            />
          </div>
        </div>

        {/* Card decks */}
        <div className={styles.cardDecks}>
          <CardDeck
            type="empire"
            onDrawCard={() => handleDrawCard("empire")}
            disabled={false}
          />
          <CardDeck
            type="chance"
            onDrawCard={() => handleDrawCard("chance")}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}
