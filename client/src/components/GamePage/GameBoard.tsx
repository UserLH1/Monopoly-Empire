import { useEffect, useState } from "react";
import styles from "../../styles/GamePage/GameBoard.module.css";
import { Player, Tile } from "../../types/GameTypes";
import BoardTile from "../BoardTile";

// Monopoly Empire specific board configuration
const BOARD_SIZE = 800; // px
const TILE_COUNT = 36; // Monopoly Empire has 36 spaces (not 40 like regular Monopoly)

export default function GameBoard({
  tiles,
  currentPlayer,
  players,
}: {
  tiles: Tile[];
  currentPlayer: number;
  players: Player[];
}) {
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
    let style: React.CSSProperties = {};
    let className = "";

    // LEFT column (positions 0-8) - BOTTOM TO TOP
    if (position >= 1 && position <= 9) {
      position = position - 1;
      style = {
        left: 0,
        bottom: `${position * tileSize}px`,
        // Use same size for all tiles including corner at position 0
        width: tileSize,
        height: tileSize,
      };
      className = position === 1 ? styles.cornerTile : styles.leftTile;
    }
    // TOP row (positions 9-17) - LEFT TO RIGHT
    else if (position >= 9 && position <= 17) {
      style = {
        top: 0,
        left: `${(position - 9) * tileSize}px`,
        // Use same size for all tiles including corner at position 9
        width: tileSize,
        height: tileSize,
      };
      className = position === 9 ? styles.cornerTile : styles.topTile;
    }
    // RIGHT column (positions 18-26) - TOP TO BOTTOM
    else if (position >= 17 && position <= 25) {
      style = {
        right: 0,
        top: `${(position - 17) * tileSize}px`,
        // Use same size for all tiles including corner at position 17
        width: tileSize,
        height: tileSize,
      };
      className = position === 18 ? styles.cornerTile : styles.rightTile;
    }
    // BOTTOM row (positions 27-35) - RIGHT TO LEFT
    else if (position >= 25) {
      style = {
        bottom: 0,
        right: `${(position - 25) * tileSize}px`,
        // Use same size for all tiles including corner at position 27
        width: tileSize,
        height: tileSize,
      };
      className = position === 25 ? styles.cornerTile : styles.bottomTile;
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
              key={`pos-${tile.position}-${tile.id}`}
              className={`${styles.tile} ${className}`}
              style={style}
            >
              {/* Use BoardTile component for tile content */}
              <BoardTile
                tile={tile}
                position={tile.position}
                totalTiles={TILE_COUNT}
              />
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
