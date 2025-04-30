import styles from "../../styles/GamePage/PlayerPanel.module.css";
import { motion } from "framer-motion"; // Asigură-te că ai instalat framer-motion

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
          ${player.money}M
        </motion.div>
      </div>

      <div className={styles.content}>
        <div className={styles.towerContainer}>
          <div className={styles.towerLabel}>Empire Tower</div>
          <div className={styles.tower}>
            <motion.div
              className={styles.towerFill}
              style={{ height: `${towerPercentage}%` }}
              initial={{ height: "0%" }}
              animate={{ height: `${towerPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            ></motion.div>
            {player.brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                className={styles.brandLogo}
                style={{
                  bottom: `${(index / 8) * 100}%`,
                  backgroundImage: `url(${brand.logo})`,
                  backgroundColor: brand.color,
                }}
                title={brand.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              ></motion.div>
            ))}
          </div>
        </div>

        <div className={styles.cardCount}>
          <motion.div 
            className={styles.cardType}
            whileHover={{ scale: 1.05 }}
          >
            <span>Brands:</span>
            <span className={styles.count}>{player.brands.length}</span>
          </motion.div>
          <motion.div 
            className={styles.cardType}
            whileHover={{ scale: 1.05 }}
          >
            <span>Empire Cards:</span>
            <span className={styles.count}>0</span>
          </motion.div>
          <motion.div 
            className={styles.cardType}
            whileHover={{ scale: 1.05 }}
          >
            <span>Chance Cards:</span>
            <span className={styles.count}>0</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
