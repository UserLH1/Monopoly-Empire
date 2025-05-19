import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../../styles/GamePage/GamePage.module.css";
import Bank from "./Bank";
import CardDeck from "./CardDecks";
import CardModal from "./CardModal";
import DiceArea from "./DiceArea";
import GameBoard from "./GameBoard";
import PlayerPanel from "./PlayerPanels";
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

type Brand = {
  id: string;
  name: string;
  logo: string;
  value: number;
  color: string;
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
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState("");

const displayNotification = (message: string) => {
  setNotification(message);
  setShowNotification(true);
  setTimeout(() => setShowNotification(false), 3000);
};
  // New state variables for rent and tax
  const [showRentModal, setShowRentModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [rentInfo, setRentInfo] = useState<{owner: string, amount: number, property: Tile | null}>({
    owner: '',
    amount: 0,
    property: null
  });
  const [taxAmount, setTaxAmount] = useState(0);

  const USE_LOCAL_JSON = true; // Set to false to use the database

  useEffect(() => {
    const loadTiles = async () => {
      setLoading(true);
      
      if (USE_LOCAL_JSON) {
        // Load from JSON file
        try {
          // You need to import the JSON file first
          import("../../assets/tiles.json").then((importedData) => {
            const tilesFromJson = importedData.default.tiles.map(tile => ({
              ...tile,
              type: tile.type as TileType
            }));
            
            setTiles(tilesFromJson);
            console.log("Tiles loaded from JSON:", tilesFromJson.length);
            setLoading(false);
          });
        } catch (error) {
          console.error("Error loading tiles from JSON:", error);
          setLoading(false);
        }
      } else {
        // Load from database (your existing code)
        try {
          const token = localStorage.getItem("token");
          
          const response = await fetch("http://localhost:8080/api/panouri", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          
          // Rest of your existing database loading code...
        } catch (error) {
          console.error("Error fetching panels from database:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTiles();
  }, []);

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
        console.log("Player positions after fetch:", 
          formattedPlayers.map(p => `${p.name}: position ${p.position}`));
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

  useEffect(() => {
    if (players.length > 0 && gameStatus === "playing") {
      // Check if any player has a non-zero position
      const anyPlayerMoved = players.some(player => player.position > 0);
      
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
      const promises = players.map(player => 
        fetch(`http://localhost:8080/api/jucatori/${player.name}/pozitiePion`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            pozitiePion: 0
          })
        })
      );
      
      await Promise.all(promises);
      console.log("All player positions initialized to start");
      
      // Update positions locally too
      setPlayers(prev => {
        const updatedPlayers = prev.map(player => ({
          ...player,
          position: 0
        }));
        console.log("Player positions after initialization:", 
          updatedPlayers.map(p => `${p.name}: position ${p.position}`));
        return updatedPlayers;
      });
    } catch (error) {
      console.error("Error initializing player positions:", error);
    }
  };

  const handleDiceRoll = async (diceValues: number[]) => {
    const diceSum = diceValues[0] + diceValues[1];
    const currentPlayer = players[currentPlayerIndex];
    const newPosition = (currentPlayer.position + diceSum) % tiles.length;
    
    console.log(`Rolling dice for ${currentPlayer.name}: ${diceSum}. New position: ${newPosition}`);

    handlePlayerMoved(newPosition);

    // Move to next player after delay
    setTimeout(() => {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }, 2000);
  };

  const handlePlayerMoved = async (newPosition: number) => {
    // Update player position locally
    setPlayers(prev => {
      const newPlayers = [...prev];
      const updatedPlayer = { ...newPlayers[currentPlayerIndex] };
      updatedPlayer.position = newPosition;
      newPlayers[currentPlayerIndex] = updatedPlayer;
      console.log("Players after position update:", 
        newPlayers.map(p => `${p.name} at position ${p.position}`));
      return newPlayers;
    });

    // Update position in database
    try {
      const token = localStorage.getItem("token");
      const currentPlayer = players[currentPlayerIndex];
      
      const response = await fetch(`http://localhost:8080/api/jucatori/${currentPlayer.name}/pozitiePion`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pozitiePion: newPosition
        })
      });

      if (!response.ok) {
        console.error("Failed to update player position in database");
        return;
      } 
      
      console.log(`Player ${currentPlayer.name} position updated to ${newPosition}`);
      
      // After position is updated, check the tile action
      const gameId = localStorage.getItem("gameId");
      if (!gameId) return;
      
      const realGameId = Number(gameId) - 1000;
      const landedTile = tiles.find(tile => tile.position === newPosition);
      
      if (!landedTile) return;
      
      // Handle different tile types
      if (landedTile.type === "brand") {
        if (USE_LOCAL_JSON) {
          // Check local ownership instead of API call
          const isOwned = players.some(player => 
            player.brands.some(brand => brand.id === landedTile.id)
          );
          
          if (isOwned) {
            // Find owner
            const ownerPlayer = players.find(player => 
              player.brands.some(brand => brand.id === landedTile.id)
            );
            
            if (ownerPlayer && ownerPlayer.name !== players[currentPlayerIndex].name) {
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
            const panelStatusResponse = await fetch(`http://localhost:8080/api/panouri/status/${panelId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (!panelStatusResponse.ok) {
              console.error(`Failed to fetch panel status for panel ${panelId}`);
              return;
            }
            
            const panelStatusData = await panelStatusResponse.json();
            const statusInfo = panelStatusData.data;
            
            if (statusInfo && statusInfo.purchased) {
              // Panel is owned - check if it's owned by current player
              if (statusInfo.ownerUsername !== currentPlayer.name) {
                // Owned by another player - calculate and charge rent
                const rentAmount = Math.floor((landedTile.value || 0) * 0.1); // 10% of value
                displayRentModal(statusInfo.ownerUsername, landedTile, rentAmount);
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
      } 
      else if (landedTile.type === "tax") {
        // Show tax modal
        displayTaxModal(landedTile.value || 100);
      } 
      else if (landedTile.type === "empire") {
        // Player landed on Empire Card tile - draw a card
        displayNotification(`${players[currentPlayerIndex].name} landed on Empire Card!`);
        
        // Add slight delay before drawing card for better UX
        setTimeout(() => {
          handleDrawCard("empire");
        }, 1000);
      }
      else if (landedTile.type === "chance") {
        // Player landed on Chance Card tile - draw a card
        displayNotification(`${players[currentPlayerIndex].name} landed on Chance Card!`);
        
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
      property
    });
    setShowRentModal(true);
  };

  const displayTaxModal = (amount: number) => {
    setTaxAmount(amount);
    setShowTaxModal(true);
  };

  // Helper function to check if a tile is owned by any player
  const isOwned = (tileId: string): boolean => {
    return players.some(player => 
      player.brands.some(brand => brand.id === tileId)
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
      const response = await fetch(`http://localhost:8080/api/jucatori/${rentInfo.owner}/platesteChirie`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          proprietar: rentInfo.owner,
          chirias: currentPlayer.name,
          valoare: rentInfo.amount,
          idPanou: parseInt(rentInfo.property?.id || "0")
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to pay rent");
      }
      
      // Update player money locally
      setPlayers(prev => {
        const newPlayers = [...prev];
        
        // Reduce current player's money
        const payingPlayer = {...newPlayers[currentPlayerIndex]};
        payingPlayer.money -= rentInfo.amount;
        newPlayers[currentPlayerIndex] = payingPlayer;
        
        // Increase owner's money
        const ownerIndex = newPlayers.findIndex(p => p.name === rentInfo.owner);
        if (ownerIndex >= 0) {
          const ownerPlayer = {...newPlayers[ownerIndex]};
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
      const response = await fetch(`http://localhost:8080/api/jucatori/${rentInfo.owner}/platesteChirie/oferaPanou`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          proprietar: rentInfo.owner,
          chirias: currentPlayer.name,
          idPanou: parseInt(rentInfo.property?.id || "0")
        })
      });
      
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
        const response = await fetch(`http://localhost:8080/api/jucatori/${currentPlayer.name}/platesteImpozitCuPanou`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Failed to pay tax with property");
        }
      } else {
        // Pay with money
        const response = await fetch(`http://localhost:8080/api/jucatori/${currentPlayer.name}/platesteImpozit`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to pay tax");
        }
        
        // Update player money locally
        setPlayers(prev => {
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
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          idPanou: parseInt(tile.id.replace("t", "")),
          idJoc: realGameId,
          idTurn: turnId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to purchase panel");
      }
      
      // Update the player's money and add brand to their collection
      setPlayers(prev => {
        const newPlayers = [...prev];
        const updatedPlayer = { ...newPlayers[currentPlayerIndex] };
        
        // Reduce player money
        updatedPlayer.money -= (tile.value || 0);
        
        // Add brand to player's collection
        const newBrand: Brand = {
          id: tile.id,
          name: tile.name,
          logo: tile.logo || "",
          value: tile.value || 0,
          color: tile.color || "#ffffff"
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
      
      const response = await fetch(`http://localhost:8080/api/jocuri/${realGameId}/turnuri`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
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
    // Create SSE connection
    const token = localStorage.getItem("token") || "";
    
    // First test the simple endpoint
    console.log("Testing SSE connection...");
    const testSource = new EventSource("http://localhost:8080/api/events/test");
    
    testSource.onopen = () => {
      console.log("Test SSE connection opened successfully");
    };
    
    testSource.addEventListener('test', (event) => {
      console.log("Test SSE message received:", event.data);
      testSource.close();
      
      // If test connection works, try the real connection
      console.log("Establishing main SSE connection...");
      const eventSource = new EventSource(`http://localhost:8080/api/events/subscribe?token=${token}`);
      
      eventSource.onopen = () => {
        console.log("Main SSE connection opened successfully");
      };
      
      // Listen for connection event
      eventSource.addEventListener('connect', (event) => {
        console.log("SSE connected:", event.data);
      });
      
      // Listen for player move events
      eventSource.addEventListener('playerMove', (event) => {
        try {
          const data = JSON.parse(event.data);
          displayNotification(data.message);
          fetchPlayerData();
        } catch (error) {
          console.error("Error parsing playerMove event:", error);
        }
      });
      
      // Error handling
      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        
        // Close and try to reconnect after delay
        eventSource.close();
        setTimeout(() => {
          console.log("Attempting to reconnect SSE...");
          // Component will re-render and useEffect will run again
        }, 5000);
      };
      
      // Clean up on unmount
      return () => {
        console.log("Closing SSE connection...");
        eventSource.close();
      };
    });
    
    testSource.onerror = (error) => {
      console.error("Test SSE connection failed:", error);
    };
    
    return () => {
      testSource.close();
    };
  }, []);

  // Make sure this useEffect runs AFTER your data is loaded
  useEffect(() => {
    // Only set up SSE if game data is loaded
    if (loading || !players.length) {
      console.log("Skipping SSE setup until game data is loaded");
      return;
    }

    console.log("Setting up SSE connection");
    const token = localStorage.getItem("token") || "";
    
    try {
      const eventSource = new EventSource(`http://localhost:8080/api/events/subscribe?token=${token}`);
      
      
      return () => {
        console.log("Cleaning up SSE connection");
        eventSource.close();
      };
    } catch (error) {
      console.error("Error creating SSE connection:", error);
    }
  }, [loading, players.length]); // Only run after loading is complete and players are loaded

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
                disabled={players[currentPlayerIndex].money < (selectedTile.value || 0)}
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
                <button 
                  className={styles.payButton}
                  onClick={handlePayRent}
                >
                  Pay Rent
                </button>
              ) : (
                <>
                  <p className={styles.warningText}>You don't have enough money!</p>
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
              <button 
                className={styles.payButton}
                onClick={handlePayTax}
              >
                {players[currentPlayerIndex].money >= taxAmount 
                  ? 'Pay with Money' 
                  : 'Pay with Property'}
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
        <div className={styles.notification}>
          {notification}
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