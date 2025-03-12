import styles from "../styles/BoardTile.module.css";
import { Tile } from "../types/GameTypes";

interface BoardTileProps {
  tile: Tile;
  position: number;
  totalTiles: number;
}

export default function BoardTile({
  tile,
  position,
  totalTiles,
}: BoardTileProps) {
  const getTilePosition = () => {
    // Logic for positioning tiles in monopoly board layout
    const side = Math.floor((position * 4) / totalTiles);
    return styles[`side${side}`];
  };

  return (
    <div className={`${styles.tile} ${getTilePosition()}`}>
      <div className={styles.tileContent}>
        <span className={styles.tileName}>{tile.name}</span>
        {tile.type === "property" && (
          <div
            className={styles.colorBand}
            style={{ backgroundColor: tile.color }}
          />
        )}
      </div>
    </div>
  );
}
