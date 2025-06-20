import { motion } from "framer-motion";
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
  // Calculate tower percentage based on max value of 800
  const towerPercentage = Math.min((player.towerHeight / 800) * 100, 100);
  const brandCount = player.brands.length;

  return (
    <motion.div
      className={`${styles.panel} ${styles[position]} ${
        isCurrentPlayer ? styles.active : ""
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header} style={{ borderColor: player.color }}>
        <div
          className={styles.avatar}
          style={{ backgroundColor: player.color }}
        >
          {player.name.charAt(0).toUpperCase()}
        </div>
        <h3 className={styles.playerName}>{player.name}</h3>
        {isCurrentPlayer && (
          <motion.div
            className={styles.activeIndicator}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            🎮
          </motion.div>
        )}
        <motion.div
          className={styles.money}
          key={player.money}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5 }}
        >
          ${player.money}
        </motion.div>
      </div>

      <div className={styles.towerWrapper}>
        <div className={styles.towerContainer}>
          <div className={styles.tower}>
            <motion.div
              className={styles.towerFill}
              style={{
                height: `${towerPercentage}%`,
                background: `linear-gradient(to top, ${player.color}88, ${player.color})`,
              }}
              initial={{ height: "0%" }}
              animate={{ height: `${towerPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            ></motion.div>
            {player.brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                className={styles.brandLogo}
                style={{
                  bottom: `${(index / (player.brands.length || 1)) * 100}%`,
                  backgroundImage: brand.logo ? `url(${brand.logo})` : "none",
                  backgroundColor: brand.logo ? "transparent" : brand.color,
                }}
                title={brand.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              ></motion.div>
            ))}
          </div>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <div className={styles.statValue}>{player.towerHeight}</div>
            <div className={styles.statLabel}>Tower Value</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statValue}>{brandCount}</div>
            <div className={styles.statLabel}>Brands</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
