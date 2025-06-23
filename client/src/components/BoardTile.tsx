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
        if (tile.name?.includes("Jail")) return "🔒";
        if (tile.name?.includes("Start")) return "🏁";
        if (tile.name?.includes("Free Parking")) return "🅿️";
        if (tile.name?.includes("Go to Jail")) return "👮";
        return "🎲";
      default:
        return "";
    }
  };

  // Get CSS classes for special corner tiles
  const getSpecialClass = () => {
    if (tile.name?.includes("Go to Jail")) return styles.goToJailTile;
    if (tile.name?.includes("Free Parking")) return styles.freeParkingTile;
    return "";
  };

  const getCorrectLogoPath = (tileName: string, originalPath: string) => {
    // Extract brand name from tile name and convert to lowercase
    const brandName = tileName
      .toLowerCase()
      .replace(/\s+/g, "") // Remove spaces
      .replace(/'/g, "") // Remove apostrophes
      .replace(/®/g, ""); // Remove registered trademark symbol

    // Map for special cases where names don't match filenames
    const specialCases: Record<string, string> = {
      twitter: "skype",
      "mcdonald's": "mcdonalds",
      mcdonalds: "mcdonalds",
      "intel®": "intel",
      intel: "intel",
      beats: "skype",
      // Add other special cases as needed
    };

    // Map extensions for specific logos (based on your folder)
    const extensionMap: Record<string, string> = {
      amazon: ".jpeg",
      candycrush: ".png",
      carnival: ".png",
      chevrolet: ".png",
      cocacola: ".png",
      ducati: ".png",
      ea: ".png",
      ebay: ".png",
      fender: ".jpeg",
      hasbro: ".png",
      jetblue: ".png",
      levis: ".jpeg",
      mcdonalds: ".jpeg",
      nerf: ".png",
      nestle: ".png",
      netflix: ".webp",
      paramount: ".png",
      polaroid: ".png",
      puma: ".jpeg",
      samsung: ".jpeg",
      skype: ".png",
      spotify: ".png",
      transformers: ".png",
      underarmour: ".png",
      universal: ".svg",
      yahoo: ".png",
    };

    try {
      // Use the special case mapping or the cleaned brand name
      let logoName =
        brandName.toLowerCase() in specialCases
          ? specialCases[brandName.toLowerCase() as keyof typeof specialCases]
          : brandName;

      // Get the correct extension or default to .png
      const extension = extensionMap[logoName] || ".png";

      // Always add the "-logo" suffix as seen in your folder structure
      return `/assets/logos/${logoName}-logo${extension}`;
    } catch (error) {
      console.warn(`Failed to load logo for ${tileName}`, error);
      return originalPath;
    }
  };

  return (
    <div
      className={`${styles.tile} ${
        styles[`type${tile.type}`]
      } ${getSpecialClass()}`}
      data-name={tile.name}
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
                style={{
                  backgroundImage: `url(${getCorrectLogoPath(
                    tile.name,
                    tile.logo
                  )})`,
                }}
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
