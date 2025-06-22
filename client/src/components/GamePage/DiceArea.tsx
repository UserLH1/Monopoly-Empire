import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "../../styles/GamePage/DiceArea.module.css";

interface DiceAreaProps {
  onRoll: (values: number[]) => void;
  disabled: boolean;
  currentPlayerName?: string; // Add this line
}

export default function DiceArea({
  onRoll,
  disabled,
  currentPlayerName,
}: DiceAreaProps) {
  const [diceValues, setDiceValues] = useState<number[]>([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    if (!rolling && diceValues[0] && diceValues[1]) {
      const sum = diceValues[0] + diceValues[1];
      setResult(sum);
      setShowResult(true);

      // Ascunde rezultatul după 3 secunde
      const timer = setTimeout(() => {
        setShowResult(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [rolling, diceValues]);

  const rollDice = () => {
    if (disabled || rolling) return;

    setRolling(true);
    setShowResult(false);

    // Animation effect with better randomization
    let counter = 0;
    const totalAnimations = 15;
    const interval = setInterval(() => {
      const values = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      setDiceValues(values);

      counter++;
      if (counter > totalAnimations) {
        clearInterval(interval);

        setTimeout(() => {
          setRolling(false);
          onRoll(values);
        }, 300);
      }
    }, 80);
  };

  // Renderează punctele în funcție de configurația standard a zarurilor
  const renderDiceDots = (value: number) => {
    switch (value) {
      case 1:
        return (
          <div className={styles.dotContainer}>
            <div className={`${styles.dot} ${styles.center}`}></div>
          </div>
        );
      case 2:
        return (
          <div className={styles.dotContainer}>
            <div className={`${styles.dot} ${styles.topLeft}`}></div>
            <div className={`${styles.dot} ${styles.bottomRight}`}></div>
          </div>
        );
      case 3:
        return (
          <div className={styles.dotContainer}>
            <div className={`${styles.dot} ${styles.topLeft}`}></div>
            <div className={`${styles.dot} ${styles.center}`}></div>
            <div className={`${styles.dot} ${styles.bottomRight}`}></div>
          </div>
        );
      case 4:
        return (
          <div className={styles.dotContainer}>
            <div className={`${styles.dot} ${styles.topLeft}`}></div>
            <div className={`${styles.dot} ${styles.topRight}`}></div>
            <div className={`${styles.dot} ${styles.bottomLeft}`}></div>
            <div className={`${styles.dot} ${styles.bottomRight}`}></div>
          </div>
        );
      case 5:
        return (
          <div className={styles.dotContainer}>
            <div className={`${styles.dot} ${styles.topLeft}`}></div>
            <div className={`${styles.dot} ${styles.topRight}`}></div>
            <div className={`${styles.dot} ${styles.center}`}></div>
            <div className={`${styles.dot} ${styles.bottomLeft}`}></div>
            <div className={`${styles.dot} ${styles.bottomRight}`}></div>
          </div>
        );
      case 6:
        return (
          <div className={styles.dotContainer}>
            <div className={`${styles.dot} ${styles.topLeft}`}></div>
            <div className={`${styles.dot} ${styles.topRight}`}></div>
            <div className={`${styles.dot} ${styles.middleLeft}`}></div>
            <div className={`${styles.dot} ${styles.middleRight}`}></div>
            <div className={`${styles.dot} ${styles.bottomLeft}`}></div>
            <div className={`${styles.dot} ${styles.bottomRight}`}></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={styles.diceArea}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {showResult && (
          <motion.div
            className={styles.diceResult}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <span className={styles.resultValue}>{result}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.diceContainer}>
        <motion.div
          className={`${styles.dice} ${rolling ? styles.rolling : ""}`}
          data-value={diceValues[0]}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {renderDiceDots(diceValues[0])}
        </motion.div>
        <motion.div
          className={`${styles.dice} ${rolling ? styles.rolling : ""}`}
          data-value={diceValues[1]}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {renderDiceDots(diceValues[1])}
        </motion.div>
      </div>

      <motion.button
        className={styles.rollButton}
        onClick={rollDice}
        disabled={disabled || rolling}
        whileHover={{ scale: 1.05, backgroundColor: "#ff6b6b" }}
        whileTap={{ scale: 0.95 }}
      >
        {rolling ? "Rolling..." : "Roll Dice"}
      </motion.button>

      {currentPlayerName && (
        <div className={styles.currentPlayer}>
          {disabled ? "Waiting for turn" : `${currentPlayerName}'s turn`}
        </div>
      )}
    </motion.div>
  );
}
