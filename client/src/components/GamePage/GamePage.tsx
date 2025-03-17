import { useState } from "react";
import styles from "../../styles/GamePage/GamePage.module.css";
import Bank from "./Bank";
import CardDeck from "./CardDecks";
import DiceArea from "./DiceArea";
import GameBoard from "./GameBoard";
import PlayerPanel from "./PlayerPanels";

// Real Monopoly Empire tiles
const monopolyEmpireTiles = [
  { id: "t0", position: 0, type: "corner", name: "GO" },
  {
    id: "t1",
    position: 1,
    type: "brand",
    name: "Nerf",
    color: "#ff8800",
    value: 150,
    logo: "/assets/brands/nerf.png",
  },
  {
    id: "t2",
    position: 2,
    type: "brand",
    name: "Transformers",
    color: "#ff8800",
    value: 150,
    logo: "/assets/brands/transformers.png",
  },
  { id: "t3", position: 3, type: "empire", name: "Empire Card" },
  {
    id: "t4",
    position: 4,
    type: "brand",
    name: "Spotify",
    color: "#1DB954",
    value: 200,
    logo: "/assets/brands/spotify.png",
  },
  {
    id: "t5",
    position: 5,
    type: "brand",
    name: "Beats",
    color: "#1DB954",
    value: 200,
    logo: "/assets/brands/beats.png",
  },
  { id: "t6", position: 6, type: "utility", name: "Tower Tax" },
  {
    id: "t7",
    position: 7,
    type: "brand",
    name: "Fender",
    color: "#1DB954",
    value: 250,
    logo: "/assets/brands/fender.png",
  },
  {
    id: "t8",
    position: 8,
    type: "brand",
    name: "Carnival",
    color: "#1DB954",
    value: 250,
    logo: "/assets/brands/carnival.png",
  },

  { id: "t9", position: 9, type: "corner", name: "Just Visiting / Jail" },
  {
    id: "t10",
    position: 10,
    type: "brand",
    name: "Jet Blue",
    color: "#87CEEB",
    value: 300,
    logo: "/assets/brands/jetblue.png",
  },
  {
    id: "t11",
    position: 11,
    type: "brand",
    name: "EA",
    color: "#87CEEB",
    value: 300,
    logo: "/assets/brands/ea.png",
  },
  { id: "t12", position: 12, type: "chance", name: "Chance" },
  {
    id: "t13",
    position: 13,
    type: "brand",
    name: "Hasbro",
    color: "#FFA500",
    value: 350,
    logo: "/assets/brands/hasbro.png",
  },
  {
    id: "t14",
    position: 14,
    type: "brand",
    name: "eBay",
    color: "#FFA500",
    value: 350,
    logo: "/assets/brands/ebay.png",
  },
  { id: "t15", position: 15, type: "utility", name: "Free Parking" },
  {
    id: "t16",
    position: 16,
    type: "brand",
    name: "X (Twitter)",
    color: "#00ACEE",
    value: 400,
    logo: "/assets/brands/twitter.png",
  },
  {
    id: "t17",
    position: 17,
    type: "brand",
    name: "Yahoo!",
    color: "#00ACEE",
    value: 400,
    logo: "/assets/brands/yahoo.png",
  },

  { id: "t18", position: 18, type: "corner", name: "Free Parking" },
  {
    id: "t19",
    position: 19,
    type: "brand",
    name: "Chevrolet",
    color: "#FF0000",
    value: 450,
    logo: "/assets/brands/chevrolet.png",
  },
  {
    id: "t20",
    position: 20,
    type: "brand",
    name: "Under Armour",
    color: "#FF0000",
    value: 450,
    logo: "/assets/brands/underarmour.png",
  },
  { id: "t21", position: 21, type: "empire", name: "Empire Card" },
  {
    id: "t22",
    position: 22,
    type: "brand",
    name: "Ducati",
    color: "#800080",
    value: 500,
    logo: "/assets/brands/ducati.png",
  },
  {
    id: "t23",
    position: 23,
    type: "brand",
    name: "Macdonalds",
    color: "#800080",
    value: 500,
    logo: "/assets/brands/mcdonalds.png",
  },
  { id: "t24", position: 24, type: "utility", name: "Rival Tower" },
  {
    id: "t25",
    position: 25,
    type: "brand",
    name: "Intel",
    color: "#0071C5",
    value: 550,
    logo: "/assets/brands/intel.png",
  },
  {
    id: "t26",
    position: 26,
    type: "brand",
    name: "Nestlé",
    color: "#0071C5",
    value: 550,
    logo: "/assets/brands/nestle.png",
  },

  { id: "t27", position: 27, type: "corner", name: "Go To Jail" },
  {
    id: "t28",
    position: 28,
    type: "brand",
    name: "Samsung",
    color: "#000000",
    value: 600,
    logo: "/assets/brands/samsung.png",
  },
  {
    id: "t29",
    position: 29,
    type: "brand",
    name: "Xbox",
    color: "#000000",
    value: 600,
    logo: "/assets/brands/xbox.png",
  },
  { id: "t30", position: 30, type: "chance", name: "Chance" },
  {
    id: "t31",
    position: 31,
    type: "brand",
    name: "Coca-Cola",
    color: "#f40000",
    value: 650,
    logo: "/assets/brands/cocacola.png",
  },
  {
    id: "t32",
    position: 32,
    type: "brand",
    name: "Universal",
    color: "#f40000",
    value: 650,
    logo: "/assets/brands/universal.png",
  },
  { id: "t33", position: 33, type: "tax", name: "Tower Tax", value: 100 },
  {
    id: "t34",
    position: 34,
    type: "brand",
    name: "Paramount",
    color: "#2E86C1",
    value: 700,
    logo: "/assets/brands/paramount.png",
  },
  {
    id: "t35",
    position: 35,
    type: "brand",
    name: "Hasbro",
    color: "#2E86C1",
    value: 750,
    logo: "/assets/brands/hasbro.png",
  },
];

const mockPlayers = [
  {
    id: "p1",
    name: "Player 1",
    color: "#e74c3c",
    money: 1500,
    position: 0,
    properties: [],
    brands: [],
    towerHeight: 0,
  },
  {
    id: "p2",
    name: "Player 2",
    color: "#3498db",
    money: 1500,
    position: 0,
    properties: [],
    brands: [],
    towerHeight: 0,
  },
  {
    id: "p3",
    name: "Player 3",
    color: "#2ecc71",
    money: 1500,
    position: 0,
    properties: [],
    brands: [],
    towerHeight: 0,
  },
  {
    id: "p4",
    name: "Player 4",
    color: "#f39c12",
    money: 1500,
    position: 0,
    properties: [],
    brands: [],
    towerHeight: 0,
  },
];

export default function GamePage() {
  const [players, setPlayers] = useState(mockPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [bankMoney, setBankMoney] = useState(15000);
  const [gameStatus, setGameStatus] = useState<
    "waiting" | "playing" | "finished"
  >("playing");

  const handleDiceRoll = (diceValues: number[]) => {
    const diceSum = diceValues[0] + diceValues[1];

    // Move current player token
    setPlayers((prev) => {
      const newPlayers = [...prev];
      const currentPlayer = { ...newPlayers[currentPlayerIndex] };

      // Calculate new position (wrapping around the board)
      currentPlayer.position =
        (currentPlayer.position + diceSum) % monopolyEmpireTiles.length;

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

  return (
    <div className={styles.gamePageContainer}>
      <div className={styles.gameContent}>
        {/* Player panels */}
        <PlayerPanel
          player={players[0]}
          isCurrentPlayer={currentPlayerIndex === 0}
          position="topLeft"
        />
        <PlayerPanel
          player={players[1]}
          isCurrentPlayer={currentPlayerIndex === 1}
          position="topRight"
        />
        <PlayerPanel
          player={players[2]}
          isCurrentPlayer={currentPlayerIndex === 2}
          position="bottomLeft"
        />
        <PlayerPanel
          player={players[3]}
          isCurrentPlayer={currentPlayerIndex === 3}
          position="bottomRight"
        />

        {/* Game board */}
        <div className={styles.boardArea}>
          <GameBoard
            //@ts-ignore
            tiles={monopolyEmpireTiles}
            currentPlayer={currentPlayerIndex}
            players={players}
          />
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

        {/* Controls area - bottom */}
        <div className={styles.controlsArea}>
          <DiceArea
            onRoll={handleDiceRoll}
            disabled={gameStatus !== "playing"}
          />
          <Bank totalMoney={bankMoney} />
        </div>
        <div className={styles.towerArea}></div>
      </div>
    </div>
  );
}
