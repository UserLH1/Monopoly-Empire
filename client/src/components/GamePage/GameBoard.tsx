import { useEffect, useState } from "react";
import styles from "../../styles/GamePage/GameBoard.module.css";

// Define types for our Monopoly Empire game
interface Player {
  id: string;
  name: string;
  color: string;
  money: number;
  position: number;
  properties: string[];
  brands: Brand[];
  towerHeight: number;
}

interface Brand {
  id: string;
  name: string;
  logo: string;
  value: number;
  color: string;
}

interface Tile {
  id: string;
  position: number;
  type: "corner" | "brand" | "empire" | "utility" | "chance" | "tax";
  name: string;
  color?: string;
  value?: number;
  logo?: string;
}

interface GameBoardProps {
  tiles: Tile[];
  currentPlayer: number;
  players: Player[];
}

// Monopoly Empire specific board configuration
const BOARD_SIZE = 800; // px
const TILE_COUNT = 36; // Monopoly Empire has 36 spaces (not 40 like regular Monopoly)

export default function GameBoard({
  tiles,
  currentPlayer,
  players,
}: GameBoardProps) {
  const [animatingPlayer, setAnimatingPlayer] = useState<string | null>(null);
  const [prevPositions, setPrevPositions] = useState<{ [key: string]: number }>(
    {}
  );
  const [tilesPerSide, setTilesPerSide] = useState({
    top: 9, // 9 tiles for top row (including corners)
    right: 9, // 9 tiles for right side (including corners)
    bottom: 9, // 9 tiles for bottom row (including corners)
    left: 9, // 9 tiles for left side (including corners)
  });

  // Calculate tile size based on board size and number of tiles per side
  const tileSize = BOARD_SIZE / Math.max(tilesPerSide.top, tilesPerSide.right);

  // Function to calculate tile position on the board in the new direction
  function calculateTilePosition(position: number) {
    // Convert 1-based position to 0-based for calculations
    const adjustedPosition = position - 1;

    let style: React.CSSProperties = {};
    let className = "";

    // LEFT column (positions 1-9) - BOTTOM TO TOP
    if (adjustedPosition < 9) {
      style = {
        left: 0,
        bottom: `${adjustedPosition * tileSize}px`,
        width: adjustedPosition === 0 ? tileSize * 1.4 : tileSize,
        height: adjustedPosition === 0 ? tileSize * 1.4 : tileSize,
      };
      className = adjustedPosition === 0 ? styles.cornerTile : styles.leftTile;
    }
    // TOP row (positions 10-18) - LEFT TO RIGHT
    else if (adjustedPosition < 18) {
      style = {
        top: 0,
        left: `${(adjustedPosition - 9 + 1) * tileSize}px`,
        width: adjustedPosition === 9 ? tileSize * 1.4 : tileSize,
        height: adjustedPosition === 9 ? tileSize * 1.4 : tileSize,
      };
      className = adjustedPosition === 9 ? styles.cornerTile : styles.topTile;
    }
    // RIGHT column (positions 19-27) - TOP TO BOTTOM
    else if (adjustedPosition < 27) {
      style = {
        right: 0,
        top: `${(adjustedPosition - 18 + 1) * tileSize}px`,
        width: adjustedPosition === 18 ? tileSize * 1.4 : tileSize,
        height: adjustedPosition === 18 ? tileSize * 1.4 : tileSize,
      };
      className =
        adjustedPosition === 18 ? styles.cornerTile : styles.rightTile;
    }
    // BOTTOM row (positions 28-36) - RIGHT TO LEFT
    else {
      style = {
        bottom: 0,
        right: `${(adjustedPosition - 27 + 1) * tileSize}px`,
        width: adjustedPosition === 27 ? tileSize * 1.4 : tileSize,
        height: adjustedPosition === 27 ? tileSize * 1.4 : tileSize,
      };
      className =
        adjustedPosition === 27 ? styles.cornerTile : styles.bottomTile;
    }

    return { style, className };
  }

  useEffect(() => {
    // Check for position changes in any player
    players.forEach((player) => {
      const prevPos = prevPositions[player.id];
      if (prevPos !== undefined && prevPos !== player.position) {
        // Position changed, trigger animation
        setAnimatingPlayer(player.id);
        const timer = setTimeout(() => {
          setAnimatingPlayer(null);
        }, 1000);
        return () => clearTimeout(timer);
      }
    });

    // Update position records
    setPrevPositions(
      players.reduce((acc, player) => {
        acc[player.id] = player.position;
        return acc;
      }, {} as { [key: string]: number })
    );
  }, [players]);

  return (
    <div className={styles.gameBoardContainer}>
      <div className={styles.gameBoard}>
        {/* Center area with logo */}
        <div className={styles.boardCenter}>
          <div className={styles.boardLogo}>
            <img
              src="/assets/logo/monopoly-empire-logo.png"
              alt="Monopoly Empire"
            />
          </div>
        </div>

        {/* Board tiles - arranged around the edge */}
        {tiles.map((tile) => {
          // Calculate position based on board layout
          const { style, className } = calculateTilePosition(tile.position);

          return (
            <div
              key={tile.id}
              className={`${styles.tile} ${className} ${getTileTypeClass(
                tile.type,
                styles
              )}`}
              style={{
                ...style,
                backgroundColor: tile.type === "brand" ? tile.color : undefined,
              }}
            >
              {/* Tile content */}
              <div className={styles.tileContent}>
                {tile.type === "brand" && (
                  <>
                    <div
                      className={styles.tileBanner}
                      style={{ backgroundColor: tile.color }}
                    ></div>
                    <div className={styles.tileName}>{tile.name}</div>
                    {tile.logo && (
                      <div
                        className={styles.tileLogo}
                        style={{ backgroundImage: `url(${tile.logo})` }}
                      ></div>
                    )}
                    {tile.value && (
                      <div className={styles.tileValue}>${tile.value}</div>
                    )}
                  </>
                )}

                {tile.type === "corner" && (
                  <div className={styles.cornerTileContent}>
                    {tile.position === 0 && (
                      <>
                        <div className={styles.goArrow}>↑</div>
                        <span className={styles.goText}>GO</span>
                        <div className={styles.goCollect}>
                          COLLECT $2M SALARY AS YOU PASS
                        </div>
                      </>
                    )}
                    {tile.position === 9 && (
                      <>
                        <div className={styles.jailSection}>
                          <div className={styles.justVisiting}>
                            JUST VISITING
                          </div>
                          <div className={styles.jailImage}></div>
                          <div className={styles.jail}>JAIL</div>
                        </div>
                      </>
                    )}
                    {tile.position === 18 && <span>FREE PARKING</span>}
                    {tile.position === 27 && (
                      <>
                        <span>GO TO</span>
                        <span>JAIL</span>
                      </>
                    )}
                  </div>
                )}

                {(tile.type === "chance" || tile.type === "empire") && (
                  <div className={styles.cardTile}>
                    <div
                      className={styles.cardIcon}
                      style={{
                        backgroundColor:
                          tile.type === "chance" ? "#FF5252" : "#2196F3",
                      }}
                    >
                      {tile.type === "chance" ? "?" : "E"}
                    </div>
                    <span>{tile.name}</span>
                  </div>
                )}

                {tile.type === "utility" && (
                  <div className={styles.utilityTile}>
                    {tile.name === "Tower Tax" && (
                      <div className={styles.taxIcon}>💰</div>
                    )}
                    {tile.name === "Rival Tower" && (
                      <div className={styles.rivalIcon}>🏢</div>
                    )}
                    <span>{tile.name}</span>
                  </div>
                )}

                {tile.type === "tax" && (
                  <div className={styles.taxTile}>
                    <div className={styles.taxIcon}>💸</div>
                    <span>{tile.name}</span>
                    {tile.value && (
                      <div className={styles.taxValue}>PAY ${tile.value}M</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Player tokens */}
        {players.map((player) => {
          const { x, y } = getPlayerTokenPosition(player.position, player.id);

          return (
            <div
              key={player.id}
              className={`${styles.playerToken} ${
                animatingPlayer === player.id ? styles.movingToken : ""
              }`}
              style={{
                backgroundColor: player.color,
                left: `${x}px`,
                top: `${y}px`,
                zIndex: animatingPlayer === player.id ? 100 : 20,
              }}
            >
              <span>{player.name.charAt(0)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// Get CSS class based on tile type
function getTileTypeClass(type: string, styles: any) {
  const typeClasses: { [key: string]: string } = {
    brand: styles.brandTile,
    corner: styles.cornerTile,
    chance: styles.chanceTile,
    empire: styles.empireTile,
    utility: styles.utilityTile,
    tax: styles.taxTile,
  };

  return typeClasses[type] || "";
}

// Calculate player token position with offset for multiple players
function getPlayerTokenPosition(position: number, playerId: string) {
  const tileSize = BOARD_SIZE / 9;

  // Find the player's index in the players array instead of parsing the ID
  // Get index from player's position in the array instead of ID parsing
  let playerIndex = 0;
  if (playerId.startsWith("p") && /p\d+/.test(playerId)) {
    // Handle "p1", "p2" style IDs
    playerIndex = parseInt(playerId.replace("p", "")) - 1;
  } else {
    // For username-based IDs, just use a simple hash to get a consistent index
    playerIndex =
      playerId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 4;
  }

  const offsetX = (playerIndex % 2) * 20;
  const offsetY = Math.floor(playerIndex / 2) * 20;

  // Base positioning logic similar to calculateTilePosition
  if (position < 9) {
    // Bottom row
    return {
      x: BOARD_SIZE - (position + 0.5) * tileSize + offsetX,
      y: BOARD_SIZE - tileSize / 2 + offsetY,
    };
  } else if (position < 18) {
    // Left column
    return {
      x: tileSize / 2 + offsetX,
      y: BOARD_SIZE - (position - 9 + 0.5) * tileSize + offsetY,
    };
  } else if (position < 27) {
    // Top row
    return {
      x: (position - 18 + 0.5) * tileSize + offsetX,
      y: tileSize / 2 + offsetY,
    };
  } else {
    // Right column
    return {
      x: BOARD_SIZE - tileSize / 2 + offsetX,
      y: (position - 27 + 0.5) * tileSize + offsetY,
    };
  }
}
