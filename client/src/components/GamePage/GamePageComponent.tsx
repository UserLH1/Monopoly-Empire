import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  drawRandomCard,
  fetchCards,
  fetchUserCards,
  useCard,
} from "../../services/CardService";

// Import types from type definition files
import { ActiveCard, Card, CardEffect, CardType } from "../../types/Card";
import {
  Brand,
  GameState,
  Player,
  Tile,
  TileType,
} from "../../types/GameTypes";
import { PlayerPanelPosition, RentInfo } from "../../types/UI";

import styles from "../../styles/GamePage/GamePage.module.css";
import CardDeck from "./CardDecks";
import CardModal from "./CardModal";
import DiceArea from "./DiceArea";
import GameBoard from "./GameBoard";
import PlayerPanel from "./PlayerPanels";

const PLAYER_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"];

const formatGameTime = (seconds: number | null): string => {
  if (seconds === null) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
};

interface GamePageComponentProps {
  syncedTime?: number | null;
}

export default function GamePageComponent({
  syncedTime,
}: GamePageComponentProps) {
  const { user } = useAuth();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [bankMoney, setBankMoney] = useState(15000);
  const [gameStatus, setGameStatus] = useState<GameState["status"]>("waiting");
  const [loading, setLoading] = useState(true);
  const [drawnCard, setDrawnCard] = useState<Card | null>(null);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [empireCards, setEmpireCards] = useState<Card[]>([]);
  const [chanceCards, setChanceCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<ActiveCard[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState("");
  const [showMoveAlert, setShowMoveAlert] = useState(false);
  const [moveAlertMessage, setMoveAlertMessage] = useState("");
  const displayNotification = (message: string) => {
    setNotification(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Use RentInfo type from UI.ts
  const [showRentModal, setShowRentModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const displayMoveAlert = (message: string) => {
    setMoveAlertMessage(message);
    setShowMoveAlert(true);
    // Keep the alert visible longer than regular notifications
    setTimeout(() => setShowMoveAlert(false), 5000);
  };
  const [rentInfo, setRentInfo] = useState<RentInfo>({
    owner: "",
    amount: 0,
    property: null,
  });
  const [taxAmount, setTaxAmount] = useState(0);

  const USE_LOCAL_JSON = false; // Set to false to use the database

  useEffect(() => {
    const loadTiles = async () => {
      setLoading(true);

      if (USE_LOCAL_JSON) {
        // Load from JSON file
        try {
          // You need to import the JSON file first
          import("../../assets/tiles.json").then((importedData) => {
            const tilesFromJson = importedData.default.tiles.map((tile) => ({
              ...tile,
              type: tile.type as TileType,
              //@ts-ignore
              valueForTower: tile.valueForTower || 0, // Ensure valueForTower exists
            }));

            setTiles(tilesFromJson as Tile[]); // Add type assertion here
            console.log("Tiles loaded from JSON:", tilesFromJson.length);
            setLoading(false);
          });
        } catch (error) {
          console.error("Error loading tiles from JSON:", error);
          setLoading(false);
        }
      } else {
        // Load from database
        try {
          const token = localStorage.getItem("token");

          const response = await fetch("http://localhost:8080/api/pozitiiJoc", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch panels from database");
          }

          const result = await response.json();
          console.log("pozitii data:", result);

          if (result.data && Array.isArray(result.data)) {
            // First, build a mapping of the correct positions
            const boardLayout: { [key: number]: number } = {};

            // Map positions as they should appear on the board:
            // Bottom row (left to right): 0-8
            boardLayout[1] = 1; // Start
            boardLayout[2] = 2; // Nerf
            boardLayout[3] = 3; // Impozit
            boardLayout[4] = 4; // Transformers
            boardLayout[5] = 5; // Empire Card
            boardLayout[6] = 6; // Yahoo
            boardLayout[7] = 7; // Under Armour
            boardLayout[8] = 8; // Levis

            // Left row (bottom to top): 9-17
            boardLayout[9] = 9; // Jail (corner)
            boardLayout[10] = 10; // Polaroid
            boardLayout[11] = 11; // Puma
            boardLayout[12] = 12; // Candy Crush
            boardLayout[13] = 13; // Unknown/Chance
            boardLayout[14] = 14; // JetBlue
            boardLayout[15] = 15; // Skype
            boardLayout[16] = 16; // Spotify
            boardLayout[17] = 17; // Go to Jail (UPDATED)

            // Top row (left to right): 18-26
            boardLayout[18] = 18; // Ducati
            boardLayout[19] = 19; // CocaCola
            boardLayout[20] = 20; // Intel
            boardLayout[21] = 21; // Empire Card
            boardLayout[22] = 22; // Samsung
            boardLayout[23] = 23; // McDonald's
            boardLayout[24] = 24; // Netflix
            boardLayout[25] = 25; // Free Parking (UPDATED)
            boardLayout[26] = 26; // Nestle

            // Right row (top to bottom): 27-35
            boardLayout[27] = 27; // Xbox
            boardLayout[28] = 28; // Chance
            boardLayout[29] = 29; // Ebay
            boardLayout[30] = 30; // Empire Card
            boardLayout[31] = 31; // Amazon
            boardLayout[32] = 32; // Universal
            boardLayout[33] = 33; // Unknown/Chance
            boardLayout[34] = 34; // Unknown/Chance
            boardLayout[35] = 35; // Unknown/Chance

            // Map the database panels to the Tile format expected by the app
            const tilesFromDb = result.data.map((panel: any) => {
              // For special corner tiles, ensure proper position
              if (panel.name === "Start") {
                panel.position = 1;
                panel.color = "#FF4500"; // Orange-red color for Start
              } else if (panel.name === "Just Visiting / Jail") {
                panel.position = 9;
                panel.color = "#4682B4"; // Steel blue for Jail
              } else if (panel.name === "Free Parking") {
                panel.position = 25;
                panel.color = "#32CD32"; // Lime green for Free Parking
              } else if (panel.name === "Go to Jail") {
                panel.position = 17;
                panel.color = "#FF6347"; // Tomato red for Go to Jail
              }

              // Fix tax type
              if (panel.type === "Impozit") {
                panel.type = "tax";
              }

              return {
                id: panel.id ? `t${panel.id}` : `tpos${panel.position}`,
                position: panel.position,
                type:
                  panel.type?.toLowerCase() ||
                  (determineTileType(panel.position) as TileType),
                name: panel.name || `Position ${panel.position}`,
                color: panel.color,
                value: panel.value || 0,
                logo: panel.logo,
                valueForTower: panel.valueForTower || 0,
              } as Tile;
            });

            // Sort tiles by position to ensure correct board layout
            tilesFromDb.sort((a: Tile, b: Tile) => a.position - b.position);

            // Remove duplicate positions (keeping the first occurrence)
            const uniqueTiles = tilesFromDb.filter(
              (tile: Tile, index: number, self: Tile[]) =>
                index ===
                self.findIndex((t: Tile) => t.position === tile.position)
            );

            // Fill any gaps in positions if needed
            const maxPosition = Math.max(
              ...uniqueTiles.map((t: Tile) => t.position)
            );
            for (let i = 1; i <= maxPosition; i++) {
              if (!uniqueTiles.find((t: Tile) => t.position === i)) {
                uniqueTiles.push({
                  id: `tpos${i}`,
                  position: i,
                  type: determineTileType(i) as TileType,
                  name: `Position ${i}`,
                  color: null,
                  value: 0,
                  logo: null,
                  valueForTower: 0,
                } as Tile);
              }
            }

            // Process tiles after all processing but before setting state
            const finalTiles = uniqueTiles.map((tile: Tile) => {
              // Ensure "Go to Jail" is at position 17
              if (tile.name === "Go to Jail") {
                return {
                  ...tile,
                  position: 17,
                  type: "corner" as TileType,
                  color: "#FF6347",
                };
              }

              // Ensure "Free Parking" is at position 25
              if (tile.name === "Free Parking") {
                return {
                  ...tile,
                  position: 25,
                  type: "corner" as TileType,
                  color: "#32CD32",
                };
              }

              // Fix position 18 (was Free Parking, now Ducati)
              if (tile.name === "Ducati") {
                return { ...tile, position: 18 };
              }

              // Fix position 27 (was Go to Jail, now Xbox)
              if (tile.name === "Xbox") {
                return { ...tile, position: 27 };
              }

              return tile;
            });

            setTiles(finalTiles);
            console.log("Tiles processed:", finalTiles);
          } else {
            console.error("Invalid panel data format from API");
          }
        } catch (error) {
          console.error("Error fetching panels from database:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    // Helper function to determine tile type based on position or other rules
    const determineTileType = (position: number): TileType => {
      // Corner positions
      if (position === 1) return "corner"; // GO
      if (position === 9) return "corner"; // Jail
      if (position === 17) return "corner"; // Go to Jail
      if (position === 25) return "corner"; // Free Parking

      // Special positions
      if ([5, 21, 30].includes(position)) return "empire";
      if ([3, 13, 28].includes(position)) return "chance";
      if ([6, 20].includes(position)) return "tax";
      if ([11, 24].includes(position)) return "utility";

      // Everything else is a brand
      return "brand";
    };

    loadTiles();
  }, []);

  const fetchPlayerData = async () => {
    try {
      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");
      if (!gameId) return;

      const realGameId = Number(gameId) - 1000;

      const response = await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/jucatori`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch player data");
      }

      const result = await response.json();
      if (result.data && Array.isArray(result.data)) {
        const formattedPlayers: Player[] = result.data.map(
          (player: any, index: number) => ({
            id: player.username || `p${index + 1}`,
            name: player.username || `Player ${index + 1}`,
            color: PLAYER_COLORS[index],
            money: player.sumaBani || 1500,
            position: player.pozitiePion || 0,
            properties: [],
            brands: [],
            towerHeight: 0,
          })
        );

        setPlayers(formattedPlayers);
        console.log(
          "Player positions after fetch:",
          formattedPlayers.map((p) => `${p.name}: position ${p.position}`)
        );
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
    async function fetchGameData() {
      try {
        const token = localStorage.getItem("token");
        const gameId = localStorage.getItem("gameId");

        if (!gameId) {
          console.error("No game ID found");
          return;
        }

        const realGameId = Number(gameId) - 1000;

        const response = await fetch(
          `http://localhost:8080/api/jocuri/${realGameId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
          towerHeight: 0,
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

        // Use cardType instead of tip for filtering
        const empireCards = generalCards.filter(
          (card: any) =>
            card.cardType && card.cardType.toUpperCase() === "EMPIRE"
        );

        const chanceCards = generalCards.filter(
          (card: any) =>
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

  useEffect(() => {
    if (players.length > 0 && gameStatus === "playing") {
      // Check if any player has a non-zero position
      const anyPlayerMoved = players.some((player) => player.position > 0);

      // Only initialize positions if all players are at position 0
      // AND we don't have a record of already initializing positions
      const positionsInitialized = localStorage.getItem("positionsInitialized");

      if (!anyPlayerMoved && !positionsInitialized) {
        console.log("First game start - initializing player positions to 0");
        // Just set the flag, but don't reset positions that may be from a saved game
        localStorage.setItem("positionsInitialized", "true");
      } else {
        console.log("Game already in progress - keeping existing positions");
      }
    }
  }, [players.length, gameStatus, players]);

  // Cleanup when game ends
  useEffect(() => {
    return () => {
      // Clean up when component unmounts (game ends)
      localStorage.removeItem("positionsInitialized");
    };
  }, []);

  const initializePlayerPositions = async () => {
    try {
      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");
      if (!gameId || !players.length) return;

      const realGameId = Number(gameId) - 1000;

      // Update each player's position to 0
      const promises = players.map((player) =>
        fetch(`http://localhost:8080/api/jucatori/${player.name}/pozitiePion`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pozitiePion: 0,
          }),
        })
      );

      await Promise.all(promises);
      console.log("All player positions initialized to start");

      // Update positions locally too
      setPlayers((prev) => {
        const updatedPlayers = prev.map((player) => ({
          ...player,
          position: 0,
        }));
        console.log(
          "Player positions after initialization:",
          updatedPlayers.map((p) => `${p.name}: position ${p.position}`)
        );
        return updatedPlayers;
      });
    } catch (error) {
      console.error("Error initializing player positions:", error);
    }
  };

  const handleDiceRoll = async (diceValues: number[]) => {
    // Check if the current user is the active player
    if (user?.name !== players[currentPlayerIndex]?.name) {
      displayNotification("Not your turn!");
      return;
    }

    const diceSum = diceValues[0] + diceValues[1];
    const currentPlayer = players[currentPlayerIndex];
    const newPosition = (currentPlayer.position + diceSum) % tiles.length;

    console.log(
      `Rolling dice for ${currentPlayer.name}: ${diceSum}. New position: ${newPosition}`
    );

    // Handle the move first
    await handlePlayerMoved(newPosition);

    // Then tell the backend to advance to next player
    try {
      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");
      if (!gameId) return;

      const realGameId = Number(gameId) - 1000;

      // Call API to change the current player
      await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/schimbaJucator`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Don't update the currentPlayerIndex here - wait for SSE event
    } catch (error) {
      console.error("Error changing player turn:", error);
    }
  };

  const handlePlayerMoved = async (newPosition: number) => {
    // Update player position locally
    setPlayers((prev) => {
      const newPlayers = [...prev];
      const updatedPlayer = { ...newPlayers[currentPlayerIndex] };
      updatedPlayer.position = newPosition;
      newPlayers[currentPlayerIndex] = updatedPlayer;
      console.log(
        "Players after position update:",
        newPlayers.map((p) => `${p.name} at position ${p.position}`)
      );
      return newPlayers;
    });

    // Update position in database
    try {
      const token = localStorage.getItem("token");
      const currentPlayer = players[currentPlayerIndex];

      const response = await fetch(
        `http://localhost:8080/api/jucatori/${currentPlayer.name}/pozitiePion`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pozitiePion: newPosition,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to update player position in database");
        return;
      }

      console.log(
        `Player ${currentPlayer.name} position updated to ${newPosition}`
      );

      // After position is updated, check the tile action
      const gameId = localStorage.getItem("gameId");
      if (!gameId) return;

      const realGameId = Number(gameId) - 1000;
      const landedTile = tiles.find((tile) => tile.position === newPosition);

      if (!landedTile) return;

      // Handle different tile types
      if (landedTile.type === "brand") {
        if (USE_LOCAL_JSON) {
          // Check local ownership instead of API call
          const isOwned = players.some((player) =>
            player.brands.some((brand) => brand.id === landedTile.id)
          );

          if (isOwned) {
            // Find owner
            const ownerPlayer = players.find((player) =>
              player.brands.some((brand) => brand.id === landedTile.id)
            );

            if (
              ownerPlayer &&
              ownerPlayer.name !== players[currentPlayerIndex].name
            ) {
              // Owned by another player - calculate and charge rent
              const rentAmount = Math.floor((landedTile.value || 0) * 0.1);
              displayRentModal(ownerPlayer.name, landedTile, rentAmount);
            } else {
              // Player landed on their own property
              displayNotification(`You own ${landedTile.name}!`);
            }
          } else {
            // Panel is available for purchase
            setSelectedTile(landedTile);
            setShowPurchaseModal(true);
          }
        } else {
          // Keep existing API call for when USE_LOCAL_JSON is false
          const panelId = parseInt(landedTile.id.replace("t", ""));

          // Check the panel's status directly using our new API
          try {
            const panelStatusResponse = await fetch(
              `http://localhost:8080/api/panouri/status/${panelId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!panelStatusResponse.ok) {
              console.error(
                `Failed to fetch panel status for panel ${panelId}`
              );
              return;
            }

            const panelStatusData = await panelStatusResponse.json();
            const statusInfo = panelStatusData.data;

            if (statusInfo && statusInfo.purchased) {
              // Panel is owned - check if it's owned by current player
              if (statusInfo.ownerUsername !== currentPlayer.name) {
                // Owned by another player - calculate and charge rent
                const rentAmount = Math.floor((landedTile.value || 0) * 0.1); // 10% of value
                displayRentModal(
                  statusInfo.ownerUsername,
                  landedTile,
                  rentAmount
                );
              } else {
                // Player landed on their own property
                displayNotification(`You own ${landedTile.name}!`);
              }
            } else {
              // Panel is available for purchase
              setSelectedTile(landedTile);
              setShowPurchaseModal(true);
            }
          } catch (error) {
            console.error("Error checking panel status:", error);
          }
        }
      } else if (landedTile.type === "tax") {
        // Show tax modal
        displayTaxModal(landedTile.value || 100);
      } else if (landedTile.type === "empire") {
        // Player landed on Empire Card tile - draw a card
        displayNotification(
          `${players[currentPlayerIndex].name} landed on Empire Card!`
        );

        // Add slight delay before drawing card for better UX
        setTimeout(() => {
          handleDrawCard("empire");
        }, 1000);
      } else if (landedTile.type === "chance") {
        // Player landed on Chance Card tile - draw a card
        displayNotification(
          `${players[currentPlayerIndex].name} landed on Chance Card!`
        );

        // Add slight delay before drawing card for better UX
        setTimeout(() => {
          handleDrawCard("chance");
        }, 1000);
      }
      // Add other tile type handling as needed
    } catch (error) {
      console.error("Error processing move:", error);
    }
  };

  // Helper functions for rent and tax modals
  const displayRentModal = (owner: string, property: Tile, amount: number) => {
    setRentInfo({
      owner,
      amount,
      property,
    });
    setShowRentModal(true);
  };

  const displayTaxModal = (amount: number) => {
    setTaxAmount(amount);
    setShowTaxModal(true);
  };

  // Helper function to check if a tile is owned by any player
  const isOwned = (tileId: string): boolean => {
    return players.some((player) =>
      player.brands.some((brand) => brand.id === tileId)
    );
  };

  // Handle rent payment
  const handlePayRent = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentPlayer = players[currentPlayerIndex];

      // Check if player has enough money
      if (currentPlayer.money < rentInfo.amount) {
        // Handle insufficient funds case
        alert("You don't have enough money to pay rent!");
        // Optionally implement property offering functionality or bankruptcy
        return;
      }

      // Make API call to pay rent
      const response = await fetch(
        `http://localhost:8080/api/jucatori/${rentInfo.owner}/platesteChirie`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            proprietar: rentInfo.owner,
            chirias: currentPlayer.name,
            valoare: rentInfo.amount,
            idPanou: parseInt(rentInfo.property?.id || "0"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to pay rent");
      }

      // Update player money locally
      setPlayers((prev) => {
        const newPlayers = [...prev];

        // Reduce current player's money
        const payingPlayer = { ...newPlayers[currentPlayerIndex] };
        payingPlayer.money -= rentInfo.amount;
        newPlayers[currentPlayerIndex] = payingPlayer;

        // Increase owner's money
        const ownerIndex = newPlayers.findIndex(
          (p) => p.name === rentInfo.owner
        );
        if (ownerIndex >= 0) {
          const ownerPlayer = { ...newPlayers[ownerIndex] };
          ownerPlayer.money += rentInfo.amount;
          newPlayers[ownerIndex] = ownerPlayer;
        }

        return newPlayers;
      });

      setShowRentModal(false);
    } catch (error) {
      console.error("Error paying rent:", error);
    }
  };

  // Handle offering property as rent payment
  const handlePayRentWithProperty = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentPlayer = players[currentPlayerIndex];

      // Make API call to offer property as rent payment
      const response = await fetch(
        `http://localhost:8080/api/jucatori/${rentInfo.owner}/platesteChirie/oferaPanou`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            proprietar: rentInfo.owner,
            chirias: currentPlayer.name,
            idPanou: parseInt(rentInfo.property?.id || "0"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to offer property as payment");
      }

      // Refresh player data to update property ownership
      fetchPlayerData();

      setShowRentModal(false);
    } catch (error) {
      console.error("Error offering property as payment:", error);
    }
  };

  // Handle tax payment
  const handlePayTax = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentPlayer = players[currentPlayerIndex];

      // Check if player has enough money
      if (currentPlayer.money < taxAmount) {
        // Handle insufficient funds case - must pay with property
        const response = await fetch(
          `http://localhost:8080/api/jucatori/${currentPlayer.name}/platesteImpozitCuPanou`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Failed to pay tax with property");
        }
      } else {
        // Pay with money
        const response = await fetch(
          `http://localhost:8080/api/jucatori/${currentPlayer.name}/platesteImpozit`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to pay tax");
        }

        // Update player money locally
        setPlayers((prev) => {
          const newPlayers = [...prev];
          const updatedPlayer = { ...newPlayers[currentPlayerIndex] };
          updatedPlayer.money -= taxAmount;
          newPlayers[currentPlayerIndex] = updatedPlayer;
          return newPlayers;
        });
      }

      setShowTaxModal(false);
      fetchPlayerData(); // Refresh data to ensure state is consistent
    } catch (error) {
      console.error("Error paying tax:", error);
    }
  };

  // Update the handleDrawCard function to update the number of cards
  const handleDrawCard = async (type: CardType) => {
    if (!user || !user.name) return;

    try {
      const gameId = localStorage.getItem("gameId");
      if (!gameId) return;

      const realGameId = Number(gameId) - 1000;
      const card = await drawRandomCard(type, realGameId, user.name);
      setDrawnCard(card);
      setShowCardModal(true);

      // Update the number of available cards
      if (type === "empire") {
        setEmpireCards((prev) => prev.filter((c) => c.idCard !== card.idCard));
      } else {
        setChanceCards((prev) => prev.filter((c) => c.idCard !== card.idCard));
      }

      // Update user cards
      fetchUserCards(user.name).then((cards) => setUserCards(cards));
    } catch (error) {
      console.error(`Error drawing ${type} card:`, error);
    }
  };

  const handleUseCard = async () => {
    if (!drawnCard || !user || !user.name) return;

    try {
      const activeCard = userCards.find(
        (card) => card.idCard === drawnCard.idCard && !card.folosit
      );

      if (activeCard) {
        await useCard(activeCard.idCardActiv);
        setShowCardModal(false);
        handleCardEffect(drawnCard);
        fetchUserCards(user.name).then((cards) => setUserCards(cards));
      }
    } catch (error) {
      console.error("Error using card:", error);
    }
  };

  const handleCardEffect = (card: Card) => {
    switch (card.efectSpecial as CardEffect) {
      case "MOVE_FORWARD":
        setPlayers((prev) => {
          const newPlayers = [...prev];
          const currentPlayer = { ...newPlayers[currentPlayerIndex] };
          currentPlayer.position =
            (currentPlayer.position + (card.valoare || 0)) % tiles.length;
          newPlayers[currentPlayerIndex] = currentPlayer;
          return newPlayers;
        });
        break;

      case "COLLECT_MONEY":
        setPlayers((prev) => {
          const newPlayers = [...prev];
          const currentPlayer = { ...newPlayers[currentPlayerIndex] };
          currentPlayer.money += card.valoare || 0;
          newPlayers[currentPlayerIndex] = currentPlayer;
          return newPlayers;
        });
        break;

      case "PAY_MONEY":
        if (players[currentPlayerIndex].money - (card.valoare || 0) >= 0) {
          setPlayers((prev) => {
            const newPlayers = [...prev];
            const currentPlayer = { ...newPlayers[currentPlayerIndex] };
            currentPlayer.money -= card.valoare || 0;
            newPlayers[currentPlayerIndex] = currentPlayer;
            return newPlayers;
          });
          setBankMoney((prev) => prev + (card.valoare || 0));
        }
        break;

      default:
        console.log("Card effect not implemented:", card.efectSpecial);
    }
  };

  const handlePurchase = async (tile: Tile) => {
    try {
      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");
      if (!token || !gameId) return;

      const realGameId = Number(gameId) - 1000;
      const currentPlayer = players[currentPlayerIndex];

      // Get the turn ID for the current player
      const turnId = await getTurnIdForPlayer(currentPlayer.name);

      const response = await fetch("http://localhost:8080/api/panou", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idPanou: parseInt(tile.id.replace("t", "")),
          idJoc: realGameId,
          idTurn: turnId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to purchase panel");
      }

      // Update the player's money and add brand to their collection
      setPlayers((prev) => {
        const newPlayers = [...prev];
        const updatedPlayer = { ...newPlayers[currentPlayerIndex] };

        // Reduce player money
        updatedPlayer.money -= tile.value || 0;

        // Add brand to player's collection
        const newBrand: Brand = {
          id: tile.id,
          name: tile.name,
          logo: tile.logo || "",
          value: tile.value || 0,
          color: tile.color || "#ffffff",
        };

        updatedPlayer.brands = [...updatedPlayer.brands, newBrand];

        // Update tower height
        updatedPlayer.towerHeight = calculateTowerHeight(updatedPlayer.brands);

        newPlayers[currentPlayerIndex] = updatedPlayer;
        return newPlayers;
      });

      // Close the modal
      setShowPurchaseModal(false);

      // Refresh player data
      fetchPlayerData();
    } catch (error) {
      console.error("Error purchasing panel:", error);
      alert("Failed to purchase panel. Please try again.");
    }
  };

  const getTurnIdForPlayer = async (username: string) => {
    try {
      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");
      if (!gameId) throw new Error("No game ID found");

      const realGameId = Number(gameId) - 1000;

      const response = await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/turnuri`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get turn information");
      }

      const data = await response.json();
      const turns = data.data || [];
      const playerTurn = turns.find((turn: any) => turn.username === username);

      if (!playerTurn) {
        throw new Error("Turn not found for player");
      }

      return playerTurn.idTurn;
    } catch (error) {
      console.error("Error getting turn ID:", error);
      throw error;
    }
  };

  // Helper to calculate tower height based on brands
  const calculateTowerHeight = (brands: Brand[]): number => {
    return brands.reduce((sum, brand) => sum + (brand.value || 0), 0);
  };

  // Add this effect to connect to SSE
  useEffect(() => {
    if (loading || !players.length) return;

    const token = localStorage.getItem("token") || "";
    const gameId = localStorage.getItem("gameId");
    if (!gameId) return;

    const realGameId = Number(gameId) - 1000;
    console.log(`Setting up SSE connection for game ${realGameId}`);

    const eventSource = new EventSource(
      `http://localhost:8080/api/events/subscribe?token=${token}&gameId=${realGameId}`
    );

    // Add these event listeners:

    // 1. For general connection status
    eventSource.addEventListener("connect", (event) => {
      console.log("SSE connected:", event.data);
    });

    // 2. For player moves (keep existing one)
    eventSource.addEventListener("playerMove", (event) => {
      console.log("Player move event received:", event.data);
      try {
        const data = JSON.parse(event.data);

        // If this move is not by the current user, show prominent alert
        if (data.username !== user?.name) {
          displayMoveAlert(data.message);
        } else {
          // For your own moves, use regular notification
          displayNotification(data.message);
        }

        fetchPlayerData();
      } catch (error) {
        console.error("Error parsing playerMove event:", error);
      }
    });

    // 3. Add new listener for turn changes
    eventSource.addEventListener("turnChange", (event) => {
      console.log("Turn change event received:", event.data);
      try {
        const data = JSON.parse(event.data);

        // Display whose turn it is now
        if (data.currentPlayer !== user?.name) {
          displayMoveAlert(`It's ${data.currentPlayer}'s turn now!`);
        } else {
          displayNotification("It's your turn now!");
        }

        // Update the current player index
        const playerIndex = players.findIndex(
          (p) => p.name === data.currentPlayer
        );
        if (playerIndex >= 0) {
          setCurrentPlayerIndex(playerIndex);
        }
      } catch (error) {
        console.error("Error parsing turnChange event:", error);
      }
    });

    // 4. Add listener for initial game state
    eventSource.addEventListener("gameState", (event) => {
      console.log("Game state event received:", event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.currentPlayer) {
          const playerIndex = players.findIndex(
            (p) => p.name === data.currentPlayer
          );
          if (playerIndex >= 0) {
            setCurrentPlayerIndex(playerIndex);
          }
        }
      } catch (error) {
        console.error("Error parsing gameState event:", error);
      }
    });

    return () => eventSource.close();
  }, [loading, players.length, user?.name]);

  if (loading || gameStatus === "waiting" || players.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <h2>Loading game data...</h2>
      </div>
    );
  }

  const playerPositions =
    players.length === 2
      ? ["topLeft", "topRight"]
      : players.length === 3
      ? ["topLeft", "topRight", "bottomLeft"]
      : ["topLeft", "topRight", "bottomLeft", "bottomRight"];

  return (
    <div className={styles.gamePageContainer}>
      <div className={styles.gameContent}>
        {players.map((player, index) => (
          <PlayerPanel
            key={player.id}
            player={player}
            isCurrentPlayer={currentPlayerIndex === index}
            position={playerPositions[index] as PlayerPanelPosition}
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
              disabled={
                gameStatus !== "playing" ||
                user?.name !== players[currentPlayerIndex]?.name
              }
              currentPlayerName={players[currentPlayerIndex]?.name}
            />
          </div>
        </div>

        {/* Left side - Chance deck positioned under left player panel */}
        <div className={styles.leftDeckContainer}>
          <CardDeck
            type="chance"
            onDrawCard={() => {}} // Remove functionality by providing empty function
            disabled={true} // Always disabled - can't click
            remainingCards={chanceCards.length}
            displayOnly={true} // Add this new prop to indicate it's for display only
          />
        </div>

        {/* Right side - Empire deck positioned under right player panel */}
        <div className={styles.rightDeckContainer}>
          <CardDeck
            type="empire"
            onDrawCard={() => {}} // Remove functionality by providing empty function
            disabled={true} // Always disabled - can't click
            remainingCards={empireCards.length}
            displayOnly={true} // Add this new prop to indicate it's for display only
          />
        </div>
      </div>

      {/* Purchase modal */}
      {showPurchaseModal && selectedTile && (
        <div className={styles.modalOverlay}>
          <div className={styles.purchaseModal}>
            <h3>Buy {selectedTile.name}?</h3>
            <p>Price: ${selectedTile.value}</p>

            <div className={styles.buttonGroup}>
              <button
                className={styles.buyButton}
                onClick={() => handlePurchase(selectedTile)}
                disabled={
                  players[currentPlayerIndex].money < (selectedTile.value || 0)
                }
              >
                Buy
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowPurchaseModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rent Modal */}
      {showRentModal && rentInfo.property && (
        <div className={styles.modalOverlay}>
          <div className={styles.rentModal}>
            <h3>Pay Rent for {rentInfo.property.name}</h3>
            <p>Owner: {rentInfo.owner}</p>
            <p>Rent Amount: ${rentInfo.amount}</p>
            <p>Your Money: ${players[currentPlayerIndex].money}</p>

            <div className={styles.buttonGroup}>
              {players[currentPlayerIndex].money >= rentInfo.amount ? (
                <button className={styles.payButton} onClick={handlePayRent}>
                  Pay Rent
                </button>
              ) : (
                <>
                  <p className={styles.warningText}>
                    You don't have enough money!
                  </p>
                  <button
                    className={styles.offerButton}
                    onClick={handlePayRentWithProperty}
                  >
                    Offer Property Instead
                  </button>
                </>
              )}
              <button
                className={styles.cancelButton}
                onClick={() => setShowRentModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Modal */}
      {showTaxModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.taxModal}>
            <h3>Pay Tax</h3>
            <p>Tax Amount: ${taxAmount}</p>
            <p>Your Money: ${players[currentPlayerIndex].money}</p>

            <div className={styles.buttonGroup}>
              <button className={styles.payButton} onClick={handlePayTax}>
                {players[currentPlayerIndex].money >= taxAmount
                  ? "Pay with Money"
                  : "Pay with Property"}
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowTaxModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification toast */}
      {showNotification && (
        <div className={styles.notification}>{notification}</div>
      )}

      {/* Prominent move alert */}
      {showMoveAlert && (
        <div className={styles.moveAlert}>
          <div className={styles.moveAlertIcon}>🎲</div>
          <div className={styles.moveAlertText}>{moveAlertMessage}</div>
        </div>
      )}

      <CardModal
        card={drawnCard}
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onUseCard={handleUseCard}
      />
    </div>
  );
}
