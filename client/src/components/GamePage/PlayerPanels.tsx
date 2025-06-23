import { motion } from "framer-motion";
import { useState } from "react";
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
  const [hoveredBrand, setHoveredBrand] = useState<Brand | null>(null);

  // Calculate tower percentage based on max value of 800
  const towerPercentage = Math.min((player.towerHeight / 800) * 100, 100);
  const brandCount = player.brands.length;

  // Sort brands by value (highest value at bottom of tower)
  const sortedBrands = [...player.brands].sort((a, b) => a.value - b.value);

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

            {/* Brand segments */}
            {sortedBrands.map((brand, index) => {
              // Calculate height percentage for this brand based on its value
              const segmentHeight = (brand.value / 800) * 100;
              // Calculate position from bottom
              const bottomPosition = sortedBrands
                .slice(0, index)
                .reduce((sum, b) => sum + (b.value / 800) * 100, 0);

              return (
                <motion.div
                  key={brand.id}
                  className={styles.brandSegment}
                  style={{
                    bottom: `${bottomPosition}%`,
                    height: `${segmentHeight}%`,
                    backgroundColor: brand.color || player.color,
                    backgroundImage: brand.logo ? `url(${brand.logo})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderBottom: index > 0 ? "2px dashed white" : "none",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  onMouseEnter={() => setHoveredBrand(brand)}
                  onMouseLeave={() => setHoveredBrand(null)}
                >
                  {/* Value indicator bubble */}
                  <div className={styles.brandValue}>${brand.value}</div>
                </motion.div>
              );
            })}

            {/* Hover tooltip */}
            {hoveredBrand && (
              <div className={styles.brandTooltip}>
                <strong>{hoveredBrand.name}</strong>
                <span>${hoveredBrand.value}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.statsContainer}>
          <div className={`${styles.statBox} ${styles.towerValueStat}`}>
            <div className={styles.statValue}>${player.towerHeight}</div>
            <div className={styles.statLabel}>Tower Value</div>
            {/* Progress bar to show how close to winning */}
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${(player.towerHeight / 800) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className={`${styles.statBox} ${styles.brandCountStat}`}>
            <div className={styles.statValue}>{brandCount}</div>
            <div className={styles.statLabel}>Brands</div>
            <div className={styles.brandIcons}>
              {brandCount > 0 &&
                Array(Math.min(brandCount, 5))
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className={styles.brandIcon}>
                      🏢
                    </span>
                  ))}
              {brandCount > 5 && (
                <span className={styles.brandIcon}>+{brandCount - 5}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
