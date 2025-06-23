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
  const userJson = localStorage.getItem("user");
  const realUser = userJson ? JSON.parse(userJson).name : null;
  const [currentUserMoney, setCurrentUserMoney] = useState<number | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [valoareDeAfisat, setValoareDeAfisat] = useState(0);

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
    const fetchPlayerMoney = async () => {
      try {
        const token = localStorage.getItem("token");
        const userJson = localStorage.getItem("user");

        if (!userJson || !token) return;

        const userObject = JSON.parse(userJson);
        const username = userObject.name;

        const response = await fetch(
          `http://localhost:8080/api/jucatori/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCurrentUserMoney(data.data.sumaBani);
          console.log("Got player money from API:", data.data.sumaBani);
        }
      } catch (error) {
        console.error("Error fetching player money:", error);
      }
    };

    fetchPlayerMoney();
  }, [showRentModal, rentInfo.property]);

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
              } else if (panel.name === "Jail (Just Visiting)") {
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

  // Define proper interfaces for API responses
  interface PlayerApiResponse {
    username: string;
    sumaBani: number;
    pozitiePion: number;
  }

  interface TurnApiResponse {
    idTurn: number;
    username: string;
    valoareTurn: number;
  }

  interface PanelApiResponse {
    idPanouCumparat: number;
    idPanouGeneral: number;
    idTurn: number;
    nume: string;
    pret: number;
  }

  interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
  }

  const fetchPlayerData = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");
      if (!gameId) return;

      const realGameId = Number(gameId) - 1000;

      // 1. First get basic player data
      const response = await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/jucatori`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch player data");
      }

      const result = (await response.json()) as ApiResponse<
        PlayerApiResponse[]
      >;
      console.log("Fetched player data:", result);

      // 2. Get tower data
      const turnResponse = await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/turnuri`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!turnResponse.ok) {
        throw new Error("Failed to fetch turn data");
      }

      const turnData = (await turnResponse.json()) as ApiResponse<
        TurnApiResponse[]
      >;
      console.log("Fetched turn data:", turnData);
      const turns = turnData.data || [];

      // 3. Get panel/brand data
      const panelsResponse = await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/panouri`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!panelsResponse.ok) {
        throw new Error("Failed to fetch panel data");
      }

      const panelsData = (await panelsResponse.json()) as ApiResponse<
        PanelApiResponse[]
      >;
      console.log("Fetched panel data:", panelsData);
      const panels = panelsData.data || [];

      // 4. Create map of turn ID to player name
      const turnIdToPlayer: Record<number, string> = {};
      turns.forEach((turn) => {
        turnIdToPlayer[turn.idTurn] = turn.username;
      });

      // 5. Create map of player name to brands
      const playerBrands: Record<string, Brand[]> = {};
      panels.forEach((panel) => {
        const ownerName = turnIdToPlayer[panel.idTurn];
        if (ownerName) {
          if (!playerBrands[ownerName]) {
            playerBrands[ownerName] = [];
          }

          // Find corresponding tile data for this panel
          const tile = tiles.find(
            (t) => parseInt(t.id.replace("t", "")) === panel.idPanouGeneral
          );

          if (tile) {
            playerBrands[ownerName].push({
              id: tile.id,
              name: tile.name,
              logo: tile.logo || "",
              value: tile.value || 0,
              color: tile.color || "#ffffff",
            });
          }
        }
      });

      // 6. Create map of player name to tower value
      const playerTowerValues: Record<string, number> = {};
      turns.forEach((turn) => {
        playerTowerValues[turn.username] = turn.valoareTurn || 0;
      });

      // 7. Build complete player objects
      if (result.data && Array.isArray(result.data)) {
        const formattedPlayers: Player[] = result.data.map(
          (player: PlayerApiResponse, index: number) => {
            const brands = playerBrands[player.username] || [];
            return {
              id: player.username || `p${index + 1}`,
              name: player.username || `Player ${index + 1}`,
              color: PLAYER_COLORS[index],
              money: player.sumaBani || 1500,
              position: player.pozitiePion || 1,
              properties: [],
              brands: brands,
              towerHeight: playerTowerValues[player.username] || 0,
            };
          }
        );

        console.log(
          "Complete player data with towers and brands:",
          formattedPlayers
        );
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
        setTimeout(ensureCurrentPlayerIsSet, 1000);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    }

    fetchGameData();
  }, []);
  useEffect(() => {
    fetchCurrentPlayer();

    // Fetch every 10 seconds as a fallback in case SSE fails
    const intervalId = setInterval(fetchCurrentPlayer, 10000);

    return () => clearInterval(intervalId);
  }, [players.length]);

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

      // Update each player's position to 1 (Start) instead of 0
      const promises = players.map((player) =>
        fetch(`http://localhost:8080/api/jucatori/${player.name}/pozitiePion`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pozitiePion: 1, // Changed from 0 to 1
          }),
        })
      );

      await Promise.all(promises);
      console.log("All player positions initialized to Start (position 1)");

      // Update positions locally too
      setPlayers((prev) => {
        const updatedPlayers = prev.map((player) => ({
          ...player,
          position: 1, // Changed from 0 to 1
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
    const BOARD_SIZE = 36;

    const newPosition =
      ((currentPlayer.position + diceSum - 1) % BOARD_SIZE) + 1;

    console.log(
      `Rolling dice for ${currentPlayer.name}: ${diceSum}. Moving from ${currentPlayer.position} to ${newPosition}`
    );
    displayNotification(
      `${currentPlayer.name} rolled ${diceValues[0]} + ${diceValues[1]} = ${diceSum}`
    );
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Handle the player's move
    await handlePlayerMoved(newPosition);

    // After the move is complete, change to next player
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
          },
        }
      );
      await checkForWin();

      // The next player will be updated via SSE event
    } catch (error) {
      console.error("Error changing player turn:", error);
    }
  };

  const handlePlayerMoved = async (newPosition: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === players[currentPlayerIndex].id
          ? { ...player, position: newPosition }
          : player
      )
    );
    // Get the current position before updating
    const currentPosition = players[currentPlayerIndex].position;
    const currentPlayer = players[currentPlayerIndex];

    console.log(
      `Moving player ${currentPlayer.name} from ${currentPosition} to ${newPosition}`
    );

    // Update position in database with details about the move
    try {
      const token = localStorage.getItem("token");

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
            oldPosition: currentPosition, // Include old position for animation
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

      // Check if player passed the Start position (position 1)
      // This happens when we move from a higher position to a lower position
      // Or when we land exactly on position 1 from a non-zero position
      if (
        (currentPosition > newPosition && newPosition !== 0) ||
        newPosition === 1
      ) {
        // Player passed "Go" - give them salary
        try {
          console.log(
            `Player ${currentPlayer.name} passed Start. Giving salary...`
          );
          const salaryResponse = await fetch(
            `http://localhost:8080/api/jucatori/${currentPlayer.name}/primesteSalariu`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (salaryResponse.ok) {
            // Show notification about salary
            displayNotification(
              `${currentPlayer.name} passed Start and received a salary!`
            );

            // Refresh player data to update money
            fetchPlayerData();
          } else {
            console.error("Failed to give salary");
          }
        } catch (error) {
          console.error("Error giving salary:", error);
        }
      }

      // Rest of your existing code for handling tile actions...
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
            const panelsResponse = await fetch(
              `http://localhost:8080/api/jocuri/${realGameId}/panouri`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (!panelsResponse.ok) {
              console.error(
                `Failed to fetch game panels (HTTP ${panelsResponse.status})`
              );
              return;
            }

            const panelsData = await panelsResponse.json();
            const purchasedPanels = panelsData.data || [];
            console.log(
              `Purchased panels for game ${realGameId}:`,
              purchasedPanels
            );

            const panelInfo = purchasedPanels.find(
              (panel: any) => panel.idPanouGeneral === panelId
            );
            console.log("Panel info in move:", panelInfo);

            if (panelInfo) {
              console.log(
                `Panel found: ${panelInfo.numePanou}, Owner: ${panelInfo.proprietar}`
              );
              // Panel is purchased - check if current player is the owner
              if (panelInfo.proprietar !== currentPlayer.name) {
                // Panel is owned by another player - calculate and charge rent
                const rentAmount = Math.floor((landedTile.value || 0) * 0.1); // 10% of value
                displayRentModal(panelInfo.proprietar, landedTile, rentAmount);
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
            console.error("Error checking panel ownership:", error);
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

      // Special handling for "Go to Jail" tile
      if (landedTile.position === 17) {
        // Position 17 is "Go to Jail"
        displayNotification(`${currentPlayer.name} was sent to Jail!`);

        // Wait a moment so players see they landed on Go To Jail first
        setTimeout(async () => {
          // Move player to Jail (position 9)
          const jailPosition = 9;

          try {
            // Update position in the database
            const jailMoveResponse = await fetch(
              `http://localhost:8080/api/jucatori/${currentPlayer.name}/pozitiePion`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  pozitiePion: jailPosition,
                  oldPosition: newPosition, // The Go To Jail position
                }),
              }
            );

            if (jailMoveResponse.ok) {
              // Update the local state to show player at jail
              setPlayers((prevPlayers) =>
                prevPlayers.map((player) =>
                  player.id === currentPlayer.id
                    ? { ...player, position: jailPosition }
                    : player
                )
              );

              displayNotification(`${currentPlayer.name} was moved to Jail!`);
            }
          } catch (error) {
            console.error("Error moving player to jail:", error);
          }
        }, 1500); // Wait 1.5 seconds before moving to jail

        // Return early to prevent other tile type processing
        return;
      }

      // Your existing tile type handling continues...
    } catch (error) {
      console.error("Error processing move:", error);
    }
  };

  // Helper functions for rent and tax modals
  // Updated displayRentModal function to fetch data first
  const displayRentModal = async (
    owner: string,
    property: Tile,
    amount: number
  ) => {
    try {
      console.log(
        "Starting to prepare rent modal for:",
        property.name,
        "Owner:",
        owner
      );

      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");

      if (!token || !gameId) {
        console.error("No token or gameId found");
        return;
      }

      const realGameId = Number(gameId) - 1000;

      // Get the latest panels data to determine the current owner
      const panelsResponse = await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/panouri`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!panelsResponse.ok) {
        throw new Error("Failed to fetch current panel ownership data");
      }

      const panelsData = await panelsResponse.json();
      const purchasedPanels = panelsData.data || [];
      const panelId = parseInt(property.id.replace("t", "") || "0");

      // Find the current owner from the panels list
      const panelInfo = purchasedPanels.find(
        (panel: any) => panel.idPanouGeneral === panelId
      );

      if (!panelInfo) {
        console.log("Panel is no longer owned by anyone");
        displayNotification("This property is not owned by anyone!");
        return;
      }

      const idturnPropietar = panelInfo.idTurn;

      // Fetch turns to find the owner's username based on turn ID
      const turnResponse = await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/turnuri`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!turnResponse.ok) {
        throw new Error("Failed to fetch turn data to determine owner");
      }

      const turnData = await turnResponse.json();
      const turns = turnData.data || [];

      const ownerTurn = turns.find(
        (turn: any) => turn.idTurn === idturnPropietar
      );

      if (!ownerTurn) {
        console.error(`Could not find owner for turn ID: ${idturnPropietar}`);
        displayNotification("Error determining property owner.");
        return;
      }

      // Set the tower value for display in the modal
      setValoareDeAfisat(ownerTurn.valoareTurn);

      const currentOwner = ownerTurn.username;
      console.log(
        `Current owner of panel ${panelId} is: ${currentOwner} with tower value ${ownerTurn.valoareTurn}`
      );
      console.log(
        `Real user: ${realUser}, Current owner: ${currentOwner}, Rent amount: ${amount}, Panel ID: ${panelId}`
      );
      if (realUser === currentOwner) {
        console.log(`Player ${realUser} owns this property - no rent needed`);
        displayNotification(`You own ${property.name}!`);
        return; // Don't show modal
      }

      // Now that we have all the data, set rentInfo and show the modal
      setRentInfo({
        owner: currentOwner,
        amount: ownerTurn.valoareTurn, // Use the actual tower value
        property,
      });

      // Finally show the modal with all data prepared
      setShowRentModal(true);
    } catch (error) {
      console.error("Error preparing rent modal:", error);
      displayNotification("Error preparing rent payment. Please try again.");
    }
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
      const gameId = localStorage.getItem("gameId");
      const realUser = localStorage.getItem("user");
      const userName = realUser ? JSON.parse(realUser).name : null;
      const currentPlayer = userName;

      if (!gameId || !token) return;
      const realGameId = Number(gameId) - 1000;

      // Get the latest panels data to determine the current owner
      const panelsResponse = await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/panouri`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!panelsResponse.ok) {
        throw new Error("Failed to fetch current panel ownership data");
      }

      const panelsData = await panelsResponse.json();
      const purchasedPanels = panelsData.data || [];

      // Get panel ID from the rentInfo
      const panelId = parseInt(rentInfo.property?.id.replace("t", "") || "0");

      // Find the current owner from the panels list
      const panelInfo = purchasedPanels.find(
        (panel: any) => panel.idPanouGeneral === panelId
      );
      console.log("Panel info:", panelInfo);

      // If panel is no longer owned or ownership changed, handle accordingly
      if (!panelInfo) {
        console.log("Panel is no longer owned by anyone");
        setShowRentModal(false);
        displayNotification("This property is no longer owned by anyone!");
        return;
      }
      const idturnPropietar = panelInfo.idTurn;

      // Fetch turns to find the owner's username based on turn ID
      const turnResponse = await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/turnuri`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!turnResponse.ok) {
        throw new Error("Failed to fetch turn data to determine owner");
      }

      const turnData = await turnResponse.json();
      const turns = turnData.data || [];
      console.log("Turns data:", turns);

      const ownerTurn = turns.find(
        (turn: any) => turn.idTurn === idturnPropietar
      );
      console.log("Owner turn value:", ownerTurn.valoareTurn);
      setValoareDeAfisat(ownerTurn.valoareTurn);

      if (!ownerTurn) {
        console.error(`Could not find owner for turn ID: ${idturnPropietar}`);
        displayNotification("Error determining property owner.");
        setShowRentModal(false);
        return;
      }
      console.log("Owner turn data:", ownerTurn);

      const currentOwner = ownerTurn.username;
      console.log(`Current owner of panel ${panelId} is: ${currentOwner}`);

      // Check if ownership changed
      if (currentOwner !== rentInfo.owner) {
        console.log(
          `Ownership changed from ${rentInfo.owner} to ${currentOwner}`
        );
      }
      console.log(
        `Current player: ${currentPlayer}, Owner: ${currentOwner}, Rent amount: ${rentInfo.amount}, Panel ID: ${panelId}`
      );

      // Make API call to pay rent to the current owner
      const response = await fetch(
        `http://localhost:8080/api/jucatori/${currentOwner}/platesteChirie`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            proprietar: currentOwner,
            chirias: currentPlayer,
            valoare: ownerTurn.valoareTurn,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to pay rent");
      }

      // Update players' money locally
      setPlayers((prev) => {
        const newPlayers = [...prev];
        // Reduce current player's money
        const payingPlayer = { ...newPlayers[currentPlayerIndex] };
        payingPlayer.money -= rentInfo.amount;
        newPlayers[currentPlayerIndex] = payingPlayer;

        // Increase owner's money
        const ownerIndex = newPlayers.findIndex((p) => p.name === currentOwner);
        if (ownerIndex >= 0) {
          const ownerPlayer = { ...newPlayers[ownerIndex] };
          ownerPlayer.money += rentInfo.amount;
          newPlayers[ownerIndex] = ownerPlayer;
        }

        return newPlayers;
      });

      setShowRentModal(false);
      displayNotification(
        `Rent of $${rentInfo.amount} paid to ${currentOwner}`
      );

      // Refresh player data
      fetchPlayerData();
    } catch (error) {
      console.error("Error paying rent:", error);
      displayNotification("Failed to pay rent. Please try again.");
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
  // Update your handlePayTax function to use available endpoints
  const handlePayTax = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentPlayer = players[currentPlayerIndex];

      // Check if player has enough money
      if (currentPlayer.money < taxAmount) {
        // Handle insufficient funds - must pay with property
        try {
          const response = await fetch(
            `http://localhost:8080/api/jucatori/${currentPlayer.name}/platesteImpozitCuPanou`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `Tax payment failed: ${response.status} - ${errorText}`
            );
            displayNotification(
              "Failed to pay tax with property. Try again later."
            );
            throw new Error(errorText || "Failed to pay tax with property");
          }

          // Success - refresh player data and show notification
          displayNotification("Tax paid with property!");
          fetchPlayerData();
        } catch (error) {
          console.error("Error paying tax with property:", error);
          displayNotification("Error processing tax payment");
        }
      } else {
        // Pay with money - directly using the existing endpoint without userId parameter
        try {
          // Call the platesteImpozit endpoint directly - no need for profile
          const response = await fetch(
            `http://localhost:8080/api/jucatori/${currentPlayer.name}/platesteImpozit`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
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

          // Show success notification
          displayNotification(`Tax of $${taxAmount} paid successfully!`);
        } catch (error) {
          console.error("Error paying tax:", error);
          displayNotification("Failed to pay tax. Please try again.");
          return; // Don't close modal so they can retry
        }
      }

      // Close the modal only if successful
      setShowTaxModal(false);
    } catch (error) {
      console.error("Error in tax payment process:", error);
      displayNotification("Tax payment error occurred");
    }
  };

  const handleDrawCard = async (type: CardType) => {
    if (!user || !user.name) return;

    try {
      const gameId = localStorage.getItem("gameId");
      if (!gameId) return;

      const realGameId = Number(gameId) - 1000;
      const card = await drawRandomCard(type, realGameId, user.name);
      setDrawnCard(card);

      // Immediately fetch updated user cards to ensure they're available
      const updatedUserCards = await fetchUserCards(user.name);
      setUserCards(updatedUserCards);

      // Now show the modal after data is refreshed
      setShowCardModal(true);

      // Update the number of available cards
      if (type === "empire") {
        setEmpireCards((prev) => prev.filter((c) => c.idCard !== card.idCard));
      } else {
        setChanceCards((prev) => prev.filter((c) => c.idCard !== card.idCard));
      }
    } catch (error) {
      console.error(`Error drawing ${type} card:`, error);
    }
  };

  const handleUseCard = async () => {
    if (!drawnCard || !user || !user.name) return;

    try {
      console.log("Trying to use card:", drawnCard);

      // First check if the drawn card already has idCardActiv (from drawRandomCard)
      if (drawnCard.idCardActiv) {
        console.log(
          "Using card with idCardActiv from drawn card:",
          drawnCard.idCardActiv
        );
        await useCard(drawnCard.idCardActiv);
        setShowCardModal(false);
        handleCardEffect(drawnCard);
        fetchUserCards(user.name).then((cards) => setUserCards(cards));
        return;
      }

      // Fallback: look in userCards
      const activeCard = userCards.find(
        (card) => card.idCard === drawnCard.idCard && !card.folosit
      );

      console.log("Found in user cards:", activeCard);

      // FIX: Check for both property names (idCardActiv and idCardActive)
      if (activeCard && (activeCard.idCardActiv || activeCard.idCardActive)) {
        const cardId = activeCard.idCardActiv || activeCard.idCardActive;
        console.log("Using card with ID:", cardId);
        await useCard(cardId as number);
        setShowCardModal(false);
        handleCardEffect(drawnCard);
        fetchUserCards(user.name).then((cards) => setUserCards(cards));
      } else {
        console.error(
          "No valid card instance found with idCardActiv/idCardActive"
        );
        displayNotification("Error: Card cannot be used at this time");
      }
    } catch (error) {
      console.error("Error using card:", error);
      displayNotification("Error using card");
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

  // Update handlePurchase function to always use current player's turn
  const handlePurchase = async (tile: Tile) => {
    try {
      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");
      const realUser = localStorage.getItem("user");
      const userName = realUser ? JSON.parse(realUser).name : null;

      if (!token || !gameId) return;

      const realGameId = Number(gameId) - 1000;

      // Make sure we're getting the CURRENT active player
      const currentPlayer = userName;
      console.log("jucatorul curent:", currentPlayer);

      // Always get the latest turn ID for the current player
      const turnResponse = await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/turnuri`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!turnResponse.ok) {
        throw new Error("Failed to get turn information");
      }

      const turnData = await turnResponse.json();

      console.log("Turn data fetched:", turnData);
      const turns = turnData.data || [];
      const playerTurn = turns.find(
        (turn: any) => turn.username === currentPlayer
      );

      if (!playerTurn) {
        throw new Error(`Turn not found for player ${currentPlayer}`);
      }

      const turnId = playerTurn.idTurn;

      console.log(
        `Purchasing ${tile.name} for player ${currentPlayer} with turn ID ${turnId}`
      );

      // Make purchase request with the verified turn ID
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
    // Add this event listener in your SSE connection section, after the other event listeners
    eventSource.addEventListener("panelPurchase", (event) => {
      console.log("Panel purchase event received:", event.data);
      try {
        const data = JSON.parse(event.data);

        // Find the purchased panel details
        const panelId = data.idPanouGeneral;
        const buyer = data.username;

        // Get panel name from tiles
        const purchasedTile = tiles.find(
          (tile) => parseInt(tile.id.replace("t", "")) === panelId
        );

        // Create a descriptive message
        const purchaseMessage = purchasedTile
          ? `${buyer} purchased ${purchasedTile.name} for $${purchasedTile.value}!`
          : `${buyer} purchased a new panel!`;

        // Show notification to everyone
        if (buyer !== user?.name) {
          // If another player made the purchase
          displayMoveAlert(purchaseMessage);
        } else {
          // If current user made the purchase
          displayNotification(purchaseMessage);
        }

        // Refresh player data to update the UI
        setTimeout(() => {
          fetchPlayerData();
        }, 1500);
      } catch (error) {
        console.error("Error processing panel purchase event:", error);
      }
    });
    // Add new listener for game end events
    eventSource.addEventListener("gameEnd", (event) => {
      console.log("GAME END EVENT RECEIVED:", event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.winner) {
          console.log(`Game over! ${data.winner} is the winner!`);

          // Update game status
          setGameStatus("finished");

          // Set winner name and show modal
          setWinnerName(data.winner);
          setShowWinnerModal(true);

          // Play victory sound if you have one
          const victorySound = new Audio("/sounds/victory.mp3");
          victorySound
            .play()
            .catch((e) => console.log("Could not play sound", e));

          // Save game result in history
          localStorage.setItem(
            `game_${gameId}_result`,
            JSON.stringify({
              winner: data.winner,
              endTime: new Date().toISOString(),
            })
          );
        }
      } catch (error) {
        console.error("Error processing game end event:", error);
      }
    });
    // 2. For player moves (keep existing one)
    eventSource.addEventListener("playerMove", (event) => {
      console.log("Player move event received:", event.data);
      try {
        const data = JSON.parse(event.data);

        // If this move is not by the current user, show prominent alert and animate token
        if (data.username !== user?.name) {
          // Find the tile name based on the position
          const landedTile = tiles.find(
            (tile) => tile.position === data.position
          );
          const tileName = landedTile
            ? landedTile.name
            : `position ${data.position}`;
          console.log(
            `Received move for ${data.username} to position ${data.position} (${tileName})`
          );
          // Create enhanced message
          let enhancedMessage = data.message;
          if (landedTile) {
            enhancedMessage = `${data.username} moved to ${tileName}`;
          }
          console.log("Enhanced message:", enhancedMessage);

          displayMoveAlert(enhancedMessage);

          // Immediately update the opponent's position for animation
          setPlayers((prevPlayers) => {
            return prevPlayers.map((player) => {
              if (player.name === data.username) {
                console.log(
                  `Moving ${player.name}'s token from ${player.position} to ${data.position}`
                );
                return {
                  ...player,
                  position: data.position,
                };
              }
              return player;
            });
          });

          // After animation completes, fetch all player data to ensure consistency
          setTimeout(() => {
            fetchPlayerData();
          }, 1200); // Slightly longer than animation duration
        } else {
          // Do the same for your own notifications
          const landedTile = tiles.find(
            (tile) => tile.position === data.position
          );
          const tileName = landedTile
            ? landedTile.name
            : `position ${data.position}`;

          let enhancedMessage = data.message;
          if (landedTile) {
            enhancedMessage = `You moved to ${tileName}`;
          }

          displayNotification(enhancedMessage);
        }
      } catch (error) {
        console.error("Error parsing playerMove event:", error);
      }
    });

    // 3. Add new listener for turn changes
    eventSource.addEventListener("turnChange", (event) => {
      console.log("TURN CHANGE EVENT RECEIVED:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("Current player from server:", data.currentPlayer);

        // Store in localStorage for persistence
        if (data.currentPlayer) {
          localStorage.setItem("currentPlayer", data.currentPlayer);
          setServerCurrentPlayer(data.currentPlayer);
        }

        // Rest of your existing code...
      } catch (error) {
        console.error("Error parsing turnChange event:", error);
      }
    });

    // And add this to restore from localStorage on page load

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

  // Add this state to track whose turn it is from the server
  const [serverCurrentPlayer, setServerCurrentPlayer] = useState<string | null>(
    null
  );
  useEffect(() => {
    const storedCurrentPlayer = localStorage.getItem("currentPlayer");
    if (storedCurrentPlayer && players.length > 0) {
      setServerCurrentPlayer(storedCurrentPlayer);

      const playerIndex = players.findIndex(
        (p) => p.name === storedCurrentPlayer
      );
      if (playerIndex >= 0) {
        setCurrentPlayerIndex(playerIndex);
      }
    }
  }, [players.length]);

  // Add this function to fetch the current player from the server
  const fetchCurrentPlayer = async () => {
    try {
      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");
      if (!gameId) return;

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
        throw new Error("Failed to fetch current player");
      }

      const result = await response.json();
      const currentPlayerFromServer = result.data?.jucatorCurent;

      console.log("Current player from server:", currentPlayerFromServer);

      if (currentPlayerFromServer) {
        setServerCurrentPlayer(currentPlayerFromServer);

        // Also update the currentPlayerIndex to match
        const playerIndex = players.findIndex(
          (p) => p.name === currentPlayerFromServer
        );
        if (playerIndex >= 0) {
          setCurrentPlayerIndex(playerIndex);
        }
      }
    } catch (error) {
      console.error("Error fetching current player:", error);
    }
  };

  if (loading || gameStatus === "waiting" || players.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <h2>Loading game data...</h2>
      </div>
    );
  } // Add this function around line 365, after fetchCurrentPlayer
  const ensureCurrentPlayerIsSet = () => {
    // If serverCurrentPlayer is null but we have players, set the first player
    if (!serverCurrentPlayer && players.length > 0) {
      console.log("No current player set, defaulting to first player");
      const firstPlayer = players[0].name;
      setServerCurrentPlayer(firstPlayer);
      setCurrentPlayerIndex(0);

      // Also update in localStorage
      localStorage.setItem("currentPlayer", firstPlayer);

      // Optionally, also update on the server if there's an API for it
      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");
      if (token && gameId) {
        const realGameId = Number(gameId) - 1000;

        // Call the server to explicitly set the current player
        fetch(`http://localhost:8080/api/jocuri/${realGameId}/schimbaJucator`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              console.log("Current player updated on server");
            }
          })
          .catch((error) => {
            console.error("Error updating current player:", error);
          });
      }
    }
  };

  const playerPositions =
    players.length === 2
      ? ["topLeft", "topRight"]
      : players.length === 3
      ? ["topLeft", "topRight", "bottomLeft"]
      : ["topLeft", "topRight", "bottomLeft", "bottomRight"];

  // Add this function near the other utility functions in your component
  const checkForWin = async () => {
    try {
      const token = localStorage.getItem("token");
      const gameId = localStorage.getItem("gameId");
      if (!gameId) return;

      const realGameId = Number(gameId) - 1000;

      const response = await fetch(
        `http://localhost:8080/api/jocuri/${realGameId}/verificareCastig`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check for win condition");
      }

      const result = await response.json();

      // If a winner was returned, game is over
      if (result.data) {
        console.log(`Winner detected: ${result.data}`);

        // Update game status
        setGameStatus("finished");

        // Set winner name and show modal instead of alert
        setWinnerName(result.data);
        setShowWinnerModal(true);

        // Don't redirect automatically - let user click button in modal
      }
    } catch (error) {
      console.error("Error checking for win condition:", error);
    }
  };

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
                (serverCurrentPlayer !== null &&
                  user?.name !== serverCurrentPlayer)
              }
              currentPlayerName={
                serverCurrentPlayer ||
                players[currentPlayerIndex]?.name ||
                "Starting player"
              }
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

      {/* Rent Modal - Enhanced Version */}
      {showRentModal && rentInfo.property && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.rentModal} ${styles.enhancedModal}`}>
            <div
              className={styles.modalHeader}
              style={{
                background: "linear-gradient(135deg, #3498db, #2980b9)",
              }}
            >
              <h3>
                <span className={styles.rentIcon}>🏢</span>
                Pay Rent
              </h3>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.rentDetails}>
                <div className={styles.propertyInfo}>
                  <img
                    src={rentInfo.property.logo || "/assets/brands/default.png"}
                    alt={rentInfo.property.name}
                    className={styles.propertyLogo}
                  />
                  <h4>{rentInfo.property.name}</h4>
                </div>

                <div className={styles.rentInfo}>
                  <p className={styles.rentDataRow}>
                    <span className={styles.label}>Property Owner:</span>
                    <span className={styles.value}>{rentInfo.owner}</span>
                  </p>
                  <p className={styles.rentDataRow}>
                    <span className={styles.label}>Tenant:</span>
                    <span className={styles.value}>{user?.name}</span>
                  </p>
                  <p className={styles.rentDataRow}>
                    <span className={styles.label}>Tower Value:</span>
                    <span className={styles.value}>${valoareDeAfisat}</span>
                  </p>
                  <p className={styles.playerBalance}>
                    <span className={styles.label}>Your Balance:</span>
                    <span className={styles.value}>
                      $
                      {currentUserMoney !== null
                        ? currentUserMoney
                        : "Loading..."}
                    </span>
                  </p>
                  {currentUserMoney !== null &&
                    currentUserMoney < taxAmount && (
                      <p className={styles.insufficientFunds}>
                        <span className={styles.warningIcon}>⚠️</span>
                        Insufficient funds! You must pay with property.
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              {players[currentPlayerIndex]?.money >= valoareDeAfisat ? (
                <button
                  className={`${styles.payButton} ${styles.moneyButton}`}
                  onClick={handlePayRent}
                >
                  <span className={styles.buttonIcon}>💵</span>
                  Pay Rent
                </button>
              ) : (
                <button
                  className={`${styles.payButton} ${styles.propertyButton}`}
                  onClick={handlePayRentWithProperty}
                >
                  <span className={styles.buttonIcon}>🏢</span>
                  Offer Property
                </button>
              )}
              <button
                className={styles.cancelButton}
                onClick={() => setShowRentModal(false)}
              >
                <span className={styles.buttonIcon}>✖️</span>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Modal */}
      {showTaxModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.taxModal} ${styles.enhancedModal}`}>
            <div className={styles.modalHeader}>
              <h3>
                <span className={styles.taxIcon}>💰</span>
                Government Tax
              </h3>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.taxDetails}>
                <div className={styles.taxInfo}>
                  <p className={styles.taxAmount}>
                    <span className={styles.label}>Amount Due:</span>
                    <span className={styles.value}>${taxAmount}</span>
                  </p>
                  <p className={styles.playerBalance}>
                    <span className={styles.label}>Your Balance:</span>
                    <span className={styles.value}>${currentUserMoney}</span>
                  </p>
                  {currentUserMoney !== null &&
                    currentUserMoney < taxAmount && (
                      <p className={styles.insufficientFunds}>
                        <span className={styles.warningIcon}>⚠️</span>
                        Insufficient funds! You must pay with property.
                      </p>
                    )}
                </div>

                <div className={styles.taxDescription}>
                  Income tax must be paid to continue your business operations.
                  {players[currentPlayerIndex].brands.length > 0 &&
                    players[currentPlayerIndex].money < taxAmount && (
                      <p>
                        You will need to offer one of your properties as
                        payment.
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              {players[currentPlayerIndex].money >= taxAmount ? (
                <button
                  className={`${styles.payButton} ${styles.moneyButton}`}
                  onClick={handlePayTax}
                >
                  <span className={styles.buttonIcon}>💵</span>
                  Pay with Cash
                </button>
              ) : (
                <button
                  className={`${styles.payButton} ${styles.propertyButton}`}
                  onClick={handlePayTax}
                >
                  <span className={styles.buttonIcon}>🏢</span>
                  Pay with Property
                </button>
              )}
              <button
                className={styles.cancelButton}
                onClick={() => setShowTaxModal(false)}
              >
                Cancel
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

      {/* Winner Modal */}
      {showWinnerModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.winnerModal} ${styles.enhancedModal}`}>
            <div
              className={styles.modalHeader}
              style={{
                background: "linear-gradient(135deg, #f1c40f, #e67e22)",
                padding: "20px",
              }}
            >
              <h2>🎉 JOC TERMINAT 🎉</h2>
            </div>

            <div
              className={styles.modalBody}
              style={{ textAlign: "center", padding: "30px" }}
            >
              <div className={styles.confetti}>
                {Array(20)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className={styles.confettiPiece}></div>
                  ))}
              </div>

              <div className={styles.winnerInfo}>
                <div className={styles.winnerTrophy}>🏆</div>
                <h3 className={styles.winnerTitle}>Câștigătorul este:</h3>
                <h1 className={styles.winnerName}>{winnerName}</h1>
                <p className={styles.winnerCongrats}>
                  Felicitări pentru victoria în Monopoly Empire!
                </p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.lobbyButton}
                onClick={() => (window.location.href = "/")}
              >
                Înapoi în Lobby
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
