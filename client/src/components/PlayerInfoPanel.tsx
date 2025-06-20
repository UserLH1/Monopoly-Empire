import styles from "../styles/PlayerInfoPanel.module.css";
import { Player } from "../types/GameTypes";

interface PlayerInfoPanelProps {
  player: Player;
  isCurrentPlayer: boolean;
}

export default function PlayerInfoPanel({
  player,
  isCurrentPlayer,
}: PlayerInfoPanelProps) {
  return (
    <div className={`${styles.panel} ${isCurrentPlayer ? styles.current : ""}`}>
      <div className={styles.header}>
        <div
          className={styles.avatar}
          style={{ backgroundColor: player.color }}
        />
        <h3>{player.name}</h3>
        <span className={styles.money}>${player.money}</span>
      </div>

      {/* Add tower visualization */}
      <div className={styles.towerContainer}>
        <h4>Tower Height: ${player.towerHeight}</h4>
        <div
          className={styles.tower}
          style={{ height: `${Math.min(100, player.towerHeight / 10)}px` }}
        >
          {player.brands.map((brand, index) => (
            <div
              key={brand.id}
              className={styles.towerSegment}
              style={{
                backgroundColor: brand.color,
                height: `${Math.min(20, brand.value / 10)}px`,
              }}
              title={`${brand.name}: $${brand.value}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.properties}>
        {player.properties.map((property) => (
          <div key={property.id} className={styles.property}>
            <div
              className={styles.propertyColor}
              style={{ backgroundColor: property.color }}
            />
            <span>{property.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
