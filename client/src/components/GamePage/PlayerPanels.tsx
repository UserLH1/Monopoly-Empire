import styles from "../../styles/GamePage/PlayerPanel.module.css";

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

interface PlayerPanelProps {
  player: Player;
  isCurrentPlayer: boolean;
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

export default function PlayerPanel({
  player,
  isCurrentPlayer,
  position,
}: PlayerPanelProps) {
  // Calculate tower height as percentage (max tower height in Empire is 8 brands)
  const towerPercentage = (player.towerHeight / 8) * 100;

  return (
    <div
      className={`${styles.panel} ${styles[position]} ${
        isCurrentPlayer ? styles.active : ""
      }`}
    >
      <div className={styles.header} style={{ borderColor: player.color }}>
        <div
          className={styles.avatar}
          style={{ backgroundColor: player.color }}
        >
          {player.name.charAt(0)}
        </div>
        <h3>{player.name}</h3>
        {isCurrentPlayer && <div className={styles.activeIndicator}>🎮</div>}
        <div className={styles.money}>${player.money}M</div>
      </div>

      <div className={styles.content}>
        <div className={styles.towerContainer}>
          <div className={styles.towerLabel}>Empire Tower</div>
          <div className={styles.tower}>
            <div
              className={styles.towerFill}
              style={{ height: `${towerPercentage}%` }}
            ></div>
            {player.brands.map((brand, index) => (
              <div
                key={brand.id}
                className={styles.brandLogo}
                style={{
                  bottom: `${(index / 8) * 100}%`,
                  backgroundImage: `url(${brand.logo})`,
                  backgroundColor: brand.color,
                }}
                title={brand.name}
              ></div>
            ))}
          </div>
        </div>

        <div className={styles.cardCount}>
          <div className={styles.cardType}>
            <span>Brands:</span>
            <span className={styles.count}>{player.brands.length}</span>
          </div>
          <div className={styles.cardType}>
            <span>Empire Cards:</span>
            <span className={styles.count}>0</span>
          </div>
          <div className={styles.cardType}>
            <span>Chance Cards:</span>
            <span className={styles.count}>0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
