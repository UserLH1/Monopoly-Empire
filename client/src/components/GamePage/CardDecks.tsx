import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../styles/GamePage/CardDeck.module.css";
import { Card, CardType } from "../../types/Card";

interface CardDeckProps {
  type: CardType;
  onDrawCard: (type: CardType) => void;
  disabled: boolean;
  remainingCards?: number;
}

export default function CardDeck({ type, onDrawCard, disabled, remainingCards = 15 }: CardDeckProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleDraw = () => {
    if (disabled || isAnimating) return;
    
    setIsAnimating(true);
    onDrawCard(type);
    
    // După un timp, resetează animația
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };
  
  return (
    <div 
      className={`${styles.cardDeck} ${styles[type]}`}
      data-testid={`${type}-deck`}
    >
      <motion.div 
        className={styles.deckContainer}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        onClick={handleDraw}
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
            animate={isAnimating ? { y: -50, opacity: 0 } : { y: 0, opacity: 1 }}
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
        
        <div className={styles.remainingCount}>
          {remainingCards} rămase
        </div>
      </motion.div>
    </div>
  );
}
