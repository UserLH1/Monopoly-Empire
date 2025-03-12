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

    // Animation effect - rapidly change dice values
    let counter = 0;
    const interval = setInterval(() => {
      const values = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      setDiceValues(values);

      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setRolling(false);
        onRoll(values);
      }
    }, 100);
  };

  return (
    <div className={styles.diceArea}>
      <div className={styles.diceContainer}>
        <div
          className={`${styles.dice} ${rolling ? styles.rolling : ""}`}
          data-value={diceValues[0]}
        >
          <div className={styles.face}>
            {Array.from({ length: diceValues[0] }).map((_, i) => (
              <div key={i} className={styles.dot}></div>
            ))}
          </div>
        </div>
        <div
          className={`${styles.dice} ${rolling ? styles.rolling : ""}`}
          data-value={diceValues[1]}
        >
          <div className={styles.face}>
            {Array.from({ length: diceValues[1] }).map((_, i) => (
              <div key={i} className={styles.dot}></div>
            ))}
          </div>
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
