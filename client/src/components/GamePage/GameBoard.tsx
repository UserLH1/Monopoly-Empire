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
  const [prevPositions, setPrevPositions] = useState<Record<string, number>>(
    {}
  );
  const [animatingPlayers, setAnimatingPlayers] = useState<
    Record<string, boolean>
  >({});
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
    // When players change, check for position changes
    const newAnimatingPlayers: Record<string, boolean> = {};

    players.forEach((player) => {
      const prevPos = prevPositions[player.id];

      // If position has changed and we have a previous position, animate
      if (prevPos !== undefined && prevPos !== player.position) {
        console.log(
          `Player ${player.name} is animating from ${prevPos} to ${player.position}`
        );
        newAnimatingPlayers[player.id] = true;

        // Stop animation after it completes
        setTimeout(() => {
          setAnimatingPlayers((prev) => ({
            ...prev,
            [player.id]: false,
          }));
        }, 1500); // Animation duration - slightly longer than the CSS transition
      }
    });

    // Start new animations
    setAnimatingPlayers((prev) => ({
      ...prev,
      ...newAnimatingPlayers,
    }));

    // Update previous positions after checking
    setPrevPositions(
      players.reduce((acc, player) => {
        acc[player.id] = player.position;
        return acc;
      }, {} as Record<string, number>)
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
          const pos = getPlayerTokenPosition(player.position, player.id);
          const isAnimating = animatingPlayers[player.id];

          return (
            <div
              key={`player-${player.id}`}
              className={`${styles.playerToken} ${
                isAnimating ? styles.animatingToken : ""
              }`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                backgroundColor: player.color,
              }}
            >
              <div className={styles.playerTokenLabel}>
                {player.name.charAt(0)}
              </div>
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
// Update this function
function getPlayerTokenPosition(position: number, playerId: string) {
  const tileSize = BOARD_SIZE / 9;

  // Calculate player index for offsets
  let playerIndex = 0;
  if (playerId.startsWith("p") && /p\d+/.test(playerId)) {
    playerIndex = parseInt(playerId.replace("p", "")) - 1;
  } else {
    playerIndex =
      playerId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 4;
  }

  const offsetX = (playerIndex % 2) * 20 - 10;
  const offsetY = Math.floor(playerIndex / 2) * 20 - 10;

  // Match the position mapping from calculateTilePosition
  if (position >= 1 && position <= 9) {
    // LEFT COLUMN (bottom to top)
    return {
      x: tileSize / 2 + offsetX,
      y: BOARD_SIZE - position * tileSize + tileSize / 2 + offsetY,
    };
  } else if (position >= 9 && position <= 17) {
    // TOP ROW (left to right)
    return {
      x: (position - 9 + 0.5) * tileSize + offsetX,
      y: tileSize / 2 + offsetY,
    };
  } else if (position >= 17 && position <= 25) {
    // RIGHT COLUMN (top to bottom)
    return {
      x: BOARD_SIZE - tileSize / 2 + offsetX,
      y: (position - 17 + 0.5) * tileSize + offsetY,
    };
  } else {
    // BOTTOM ROW (right to left)
    return {
      x: BOARD_SIZE - (position - 25 + 0.5) * tileSize + offsetX,
      y: BOARD_SIZE - tileSize / 2 + offsetY,
    };
  }
}
