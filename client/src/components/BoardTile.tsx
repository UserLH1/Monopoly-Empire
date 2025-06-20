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
    const side = Math.floor((position * 4) / totalTiles);
    return styles[`side${side}`];
  };

  const getIconForType = () => {
    switch (tile.type) {
      case "chance":
        return "❓";
      case "empire":
        return "🏢";
      case "utility":
        return "💡";
      case "tax":
        return "💰";
      case "corner":
        if (tile.name?.includes("Jail") && tile.position === 9) return "🔒";
        if (tile.name?.includes("Start")) return "🏁";
        if (tile.name?.includes("Free Parking")) return "🅿️";
        if (tile.name?.includes("Go to Jail")) return "👮";
        return "🎲";
      default:
        return "";
    }
  };

  return (
    <div
      className={`${styles.tile} ${getTilePosition()} ${
        styles[`type${tile.type}`]
      }`}
      style={
        { "--position": position % (totalTiles / 4) } as React.CSSProperties
      }
    >
      <div className={styles.tileContent}>
        {tile.type === "brand" && (
          <>
            <div
              className={styles.colorBanner}
              style={{ backgroundColor: tile.color || "#ccc" }}
            />

            {tile.logo ? (
              <div
                className={styles.tileLogo}
                style={{ backgroundImage: `url(${tile.logo})` }}
              />
            ) : (
              <div className={styles.tileIcon}>{getIconForType()}</div>
            )}

            <div className={styles.tileName}>{tile.name}</div>

            <div className={styles.tileDetails}>
              {tile.value > 0 && <span>${tile.value}</span>}
              {tile.valueForTower > 0 && (
                <span className={styles.towerValue}>+{tile.valueForTower}</span>
              )}
            </div>
          </>
        )}

        {(tile.type === "chance" || tile.type === "empire") && (
          <>
            <div className={styles.tileIcon}>{getIconForType()}</div>
            <div className={styles.tileName}>{tile.name}</div>
          </>
        )}

        {(tile.type === "corner" ||
          tile.type === "utility" ||
          tile.type === "tax") && (
          <>
            <div className={styles.tileIcon}>{getIconForType()}</div>
            <div className={styles.tileName}>{tile.name}</div>
            {tile.type === "tax" && tile.value > 0 && (
              <div className={styles.tileValue}>Pay ${tile.value}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
