import styles from "../../styles/GamePage/Bank.module.css";
interface BankProps {
  totalMoney: number;
  onTransaction?: (amount: number) => void;
}

export default function Bank({ totalMoney, onTransaction }: BankProps) {
  return (
    <div className={styles.bankContainer}>
      <div className={styles.bankHeader}>
        <h3>Bank</h3>
        <div className={styles.totalMoney}>${totalMoney.toLocaleString()}</div>
      </div>

      <div className={styles.transactions}>
        <p className={styles.transactionInfo}>
          Payments are processed automatically
        </p>
        <div className={styles.bankLogo}>
          <span>ME</span>
          <span className={styles.bankName}>Monopoly Empire Bank</span>
        </div>
      </div>
    </div>
  );
}
