import { useState } from "react";
import styles from "../../styles/GamePage/DiceArea.module.css";

interface DiceAreaProps {
  onRoll: (values: number[]) => void;
  disabled?: boolean;
}

export default function DiceArea({ onRoll, disabled = false }: DiceAreaProps) {
  const [diceValues, setDiceValues] = useState<number[]>([1, 1]);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (disabled || rolling) return;

    setRolling(true);

    // Animation effect with better randomization
    let counter = 0;
    const totalAnimations = 15; // Mai multe frame-uri pentru animație mai fluidă
    const interval = setInterval(() => {
      const values = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      setDiceValues(values);

      counter++;
      if (counter > totalAnimations) {
        clearInterval(interval);
        
        // Rezultat final cu delay pentru efect mai bun
        setTimeout(() => {
          setRolling(false);
          onRoll(values);
        }, 300);
      }
    }, 80); // Animație mai rapidă
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
    <div className={styles.diceArea}>
      <div className={styles.diceContainer}>
        <div
          className={`${styles.dice} ${rolling ? styles.rolling : ""}`}
          data-value={diceValues[0]}
        >
          {renderDiceDots(diceValues[0])}
        </div>
        <div
          className={`${styles.dice} ${rolling ? styles.rolling : ""}`}
          data-value={diceValues[1]}
        >
          {renderDiceDots(diceValues[1])}
        </div>
      </div>

      <button
        className={styles.rollButton}
        onClick={rollDice}
        disabled={disabled || rolling}
      >
        {rolling ? "Rolling..." : "Roll Dice"}
      </button>
    </div>
  );
}
