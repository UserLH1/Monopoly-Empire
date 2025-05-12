import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../../styles/GamePage/GamePage.module.css";
import Bank from "./Bank";
import CardDeck from "./CardDecks";
import CardModal from "./CardModal";
import DiceArea from "./DiceArea";
import GameBoard from "./GameBoard";
import PlayerPanel from "./PlayerPanels";
import tileData from "../../assets/tiles.json";
import useAuth from "../../hooks/useAuth";
import { Card, ActiveCard, CardType } from "../../types/Card";
import {
  fetchCards,
  fetchCardsByGame,
  fetchUserCards,
  drawRandomCard,
  useCard
} from "../../services/CardService";

type TileType = "empire" | "chance" | "corner" | "brand" | "utility" | "tax";

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

const PLAYER_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"];

const formatGameTime = (seconds: number | null): string => {
  if (seconds === null) return "00:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

interface GamePageComponentProps {
  syncedTime?: number | null;
}

export default function GamePageComponent({ syncedTime }: GamePageComponentProps) {
  const { user } = useAuth();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [bankMoney, setBankMoney] = useState(15000);
  const [gameStatus, setGameStatus] = useState<"waiting" | "playing" | "finished">("waiting");
  const [loading, setLoading] = useState(true);
  const [drawnCard, setDrawnCard] = useState<Card | null>(null);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [empireCards, setEmpireCards] = useState<Card[]>([]);
  const [chanceCards, setChanceCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<ActiveCard[]>([]);

  const fetchPlayerData = async () => {
    try {
      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");
      if (!gameId) return;

      const realGameId = Number(gameId) - 1000;
      
      const response = await fetch(`http://localhost:8080/api/jocuri/${realGameId}/jucatori`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch player data");
      }

      const result = await response.json();
      if (result.data && Array.isArray(result.data)) {
        const formattedPlayers: Player[] = result.data.map((player: any, index: number) => ({
          id: player.username || `p${index + 1}`,
          name: player.username || `Player ${index + 1}`,
          color: PLAYER_COLORS[index],
          money: player.sumaBani || 1500,
          position: player.pozitiePion || 0,
          properties: [],
          brands: [],
          towerHeight: 0
        }));
        
        setPlayers(formattedPlayers);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching player data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerData();
    const intervalId = setInterval(fetchPlayerData, 50000); // Fetch player data every 50 seconds
    console.log("player data fetched every 50 seconds");
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    try {
      const validatedTiles = tileData.tiles.map(tile => {
        const validType = ["empire", "chance", "corner", "brand", "utility", "tax"].includes(tile.type);
        if (!validType) {
          console.error(`Tip de dale invalid: ${tile.type} pentru ${tile.name}`);
          return { ...tile, type: "utility" as TileType };
        }
        return tile as Tile;
      });
      
      setTiles(validatedTiles);
    } catch (error) {
      console.error("Eroare la încărcarea datelor pentru dale:", error);
    }
  }, []);
  
  useEffect(() => {
    async function fetchGameData() {
      try {
        const token = localStorage.getItem("token");
        const gameId = localStorage.getItem("gameId");
        
        if (!gameId) {
          console.error("No game ID found");
          return;
        }
        
        const realGameId = Number(gameId) - 1000;
        
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
        
        const playerNames = gameData.jucatori.split(";");
        
        const gamePlayers = playerNames.map((name: string, index: number) => ({
          id: `p${index + 1}`,
          name: name.trim(),
          color: PLAYER_COLORS[index],
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

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const generalCards = await fetchCards("GENERAL");
        console.log("All cards:", generalCards);
        
        // Folosește cardType în loc de tip pentru filtrare
        const empireCards = generalCards.filter((card: any) => 
          card.cardType && card.cardType.toUpperCase() === "EMPIRE"
        );
        
        const chanceCards = generalCards.filter((card: any) => 
          card.cardType && card.cardType.toUpperCase() === "CHANCE"
        );
        
        console.log("Empire cards found:", empireCards.length);
        console.log("Chance cards found:", chanceCards.length);
        
        setEmpireCards(empireCards);
        setChanceCards(chanceCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCardData();
  }, []);

  useEffect(() => {
    const fetchUserCardData = async () => {
      if (!user || !user.name) return;
      
      try {
        const cards = await fetchUserCards(user.name);
        setUserCards(cards);
      } catch (error) {
        console.error("Error fetching user cards:", error);
      }
    };

    fetchUserCardData();
  }, [user]);

  const handleDiceRoll = (diceValues: number[]) => {
    const diceSum = diceValues[0] + diceValues[1];

    setPlayers((prev) => {
      const newPlayers = [...prev];
      const currentPlayer = { ...newPlayers[currentPlayerIndex] };
      currentPlayer.position = (currentPlayer.position + diceSum) % tiles.length;
      newPlayers[currentPlayerIndex] = currentPlayer;
      return newPlayers;
    });

    setTimeout(() => {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }, 2000);
  };

  // Modifică funcția handleDrawCard pentru a actualiza numărul de carduri
  const handleDrawCard = async (type: CardType) => {
    if (!user || !user.name) return;
    
    try {
      const gameId = localStorage.getItem("gameId");
      if (!gameId) return;
      
      const realGameId = Number(gameId) - 1000;
      const card = await drawRandomCard(type, realGameId, user.name);
      setDrawnCard(card);
      setShowCardModal(true);
      
      // Actualizează numărul de carduri disponibile
      if (type === "empire") {
        setEmpireCards(prev => prev.filter(c => c.idCard !== card.idCard));
      } else {
        setChanceCards(prev => prev.filter(c => c.idCard !== card.idCard));
      }
      
      // Actualizează cardurile utilizatorului
      fetchUserCards(user.name).then(cards => setUserCards(cards));
    } catch (error) {
      console.error(`Error drawing ${type} card:`, error);
    }
  };

  const handleUseCard = async () => {
    if (!drawnCard || !user || !user.name) return;
    
    try {
      const activeCard = userCards.find(card => card.idCard === drawnCard.idCard && !card.folosit);
      
      if (activeCard) {
        await useCard(activeCard.idCardActiv);
        setShowCardModal(false);
        handleCardEffect(drawnCard);
        fetchUserCards(user.name).then(cards => setUserCards(cards));
      }
    } catch (error) {
      console.error("Error using card:", error);
    }
  };

  const handleCardEffect = (card: Card) => {
    switch (card.efectSpecial) {
      case "MOVE_FORWARD":
        setPlayers(prev => {
          const newPlayers = [...prev];
          const currentPlayer = { ...newPlayers[currentPlayerIndex] };
          currentPlayer.position = (currentPlayer.position + (card.valoare || 0)) % tiles.length;
          newPlayers[currentPlayerIndex] = currentPlayer;
          return newPlayers;
        });
        break;
        
      case "COLLECT_MONEY":
        setPlayers(prev => {
          const newPlayers = [...prev];
          const currentPlayer = { ...newPlayers[currentPlayerIndex] };
          currentPlayer.money += card.valoare || 0;
          newPlayers[currentPlayerIndex] = currentPlayer;
          return newPlayers;
        });
        break;
        
      case "PAY_MONEY":
        if ((players[currentPlayerIndex].money - (card.valoare || 0)) >= 0) {
          setPlayers(prev => {
            const newPlayers = [...prev];
            const currentPlayer = { ...newPlayers[currentPlayerIndex] };
            currentPlayer.money -= card.valoare || 0;
            newPlayers[currentPlayerIndex] = currentPlayer;
            return newPlayers;
          });
          setBankMoney(prev => prev + (card.valoare || 0));
        }
        break;
        
      default:
        console.log("Card effect not implemented:", card.efectSpecial);
    }
  };

  if (loading || gameStatus === "waiting" || players.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <h2>Loading game data...</h2>
      </div>
    );
  }

  const playerPositions = players.length === 2 
    ? ["topLeft", "topRight"] 
    : players.length === 3
    ? ["topLeft", "topRight", "bottomLeft"]
    : ["topLeft", "topRight", "bottomLeft", "bottomRight"];

  return (
    <div className={styles.gamePageContainer}>
      <div >
        <div className={styles.topBank}>
          <Bank totalMoney={bankMoney} onTransaction={() => {}} />
        </div>
      </div>

      <div className={styles.gameContent}>
        {players.map((player, index) => (
          <PlayerPanel
            key={player.id}
            player={player}
            isCurrentPlayer={currentPlayerIndex === index}
            position={playerPositions[index] as "topLeft" | "topRight" | "bottomLeft" | "bottomRight"}
          />
        ))}

        <div className={styles.boardArea}>
          <GameBoard
            tiles={tiles}
            currentPlayer={currentPlayerIndex}
            players={players}
          />

          <div className={styles.centerDiceArea}>
            <DiceArea
              onRoll={handleDiceRoll}
              disabled={gameStatus !== "playing"}
            />
          </div>
        </div>

        <div className={styles.cardDecks}>
          <CardDeck
            type="empire"
            onDrawCard={() => handleDrawCard("empire")}
            disabled={gameStatus !== "playing" || currentPlayerIndex !== players.findIndex(p => p.name === user?.name)}
            remainingCards={empireCards.length}
          />
          <CardDeck
            type="chance"
            onDrawCard={() => handleDrawCard("chance")}
            disabled={gameStatus !== "playing" || currentPlayerIndex !== players.findIndex(p => p.name === user?.name)}
            remainingCards={chanceCards.length}
          />
        </div>
      </div>

      <CardModal
        card={drawnCard}
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onUseCard={handleUseCard}
      />
    </div>
  );
}
