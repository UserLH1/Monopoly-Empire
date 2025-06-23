import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styles from "../../styles/GamePage/CardDeck.module.css";

interface CardDeckProps {
  type: "empire" | "chance";
  onDrawCard: () => void;
  disabled: boolean;
  remainingCards: number;
  displayOnly?: boolean; // Add this prop
}

export default function CardDeck({
  type,
  onDrawCard,
  disabled,
  remainingCards,
  displayOnly = false,
}: CardDeckProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDraw = () => {
    if (disabled || isAnimating) return;

    setIsAnimating(true);
    onDrawCard();

    // După un timp, resetează animația
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div
      className={`${styles.cardDeck} ${styles[type]} ${
        displayOnly ? styles.displayOnly : ""
      }`}
      onClick={displayOnly ? undefined : handleDraw}
      style={{
        cursor: displayOnly ? "default" : disabled ? "not-allowed" : "pointer",
      }}
    >
      <div className={styles.deckLabel}>
        {type === "empire" ? "Empire" : "Chance"}
      </div>

      <motion.div
        className={styles.deckContainer}
        whileHover={!disabled ? { scale: 1.05 } : {}}
      >
        <AnimatePresence>
          {/* Card-uri de fundal pentru efect de pachet */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`background-${i}`}
              className={styles.backgroundCard}
              style={{ marginTop: i * 2, marginLeft: i * 1 }}
            />
          ))}

          {/* Cardul principal */}
          <motion.div
            className={`${styles.card} ${isAnimating ? styles.drawing : ""}`}
            animate={
              isAnimating ? { y: -50, opacity: 0 } : { y: 0, opacity: 1 }
            }
            transition={{ type: "spring" }}
          >
            <div className={styles.cardFace}>
              <div className={styles.cardIcon}>
                {type === "chance" ? "?" : "E"}
              </div>
              <h3>{type === "chance" ? "CHANCE" : "EMPIRE"}</h3>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Card count badge */}
        <div className={styles.cardCount}>{remainingCards}</div>
      </motion.div>

      {!displayOnly && (
        <div className={styles.deckInstruction}>
          {disabled ? "Wait for your turn" : "Click to draw"}
        </div>
      )}
    </div>
  );
}
