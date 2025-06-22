import { motion } from "framer-motion";
import styles from "../../styles/GamePage/CardModal.module.css";
import { Card } from "../../types/Card";

interface CardModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onUseCard?: () => void;
}

export default function CardModal({
  card,
  isOpen,
  onClose,
  onUseCard,
}: CardModalProps) {
  if (!isOpen || !card) return null;

  // Determinăm tipul de card (chance sau empire)
  const cardType =
    card.cardType?.toLowerCase() === "chance" ? "chance" : "empire";

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${styles.cardModal} ${styles[cardType]}`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <div className={styles.cardHeader}>
          <h2>{card.cardType}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.cardContent}>
          {card.imagine && (
            <div className={styles.cardImage}>
              <img src={card.imagine} alt={card.descriere} />
            </div>
          )}

          <h3 className={styles.cardTitle}>
            {card.titlu || card.descriere.split(".")[0]}
          </h3>
          <p className={styles.cardDescription}>{card.descriere}</p>

          {card.valoare && (
            <div className={styles.cardValue}>
              <span>Valoare: ${card.valoare}</span>
            </div>
          )}
        </div>

        <div className={styles.cardActions}>
          <motion.button
            className={styles.useButton}
            onClick={onUseCard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Aplică efectul
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
