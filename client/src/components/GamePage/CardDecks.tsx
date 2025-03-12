import { useState } from "react";
import styles from "../../styles/GamePage/CardDeck.module.css";

interface CardDeckProps {
  type: "empire" | "chance";
  onDrawCard: () => void;
  disabled?: boolean;
}

export default function CardDeck({
  type,
  onDrawCard,
  disabled = false,
}: CardDeckProps) {
  const [animation, setAnimation] = useState(false);

  const handleDraw = () => {
    if (disabled) return;

    setAnimation(true);
    setTimeout(() => {
      setAnimation(false);
      onDrawCard();
    }, 500);
  };

  return (
    <div className={styles.deckContainer}>
      <h3 className={styles.deckTitle}>
        {type === "empire" ? "Empire Cards" : "Chance Cards"}
      </h3>

      <div
        className={`${styles.deck} ${styles[type]} ${
          animation ? styles.drawing : ""
        }`}
        onClick={handleDraw}
      >
        <div className={styles.cardBack}>{type === "empire" ? "E" : "?"}</div>
      </div>
    </div>
  );
}
