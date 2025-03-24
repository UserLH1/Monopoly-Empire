import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  const handleRegister = () => {
    navigate("/register");
  };

  const handleCreateGame = () => {
    navigate("/setup");
  };

  const handleJoinGame = () => {
    navigate("/game");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Monopoly Empire</h1>
        {user ? (
          <div className={styles.userPanel}>
            <span>Welcome, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div className={styles.buttonGroup}>
            <button onClick={handleLogin} className={styles.loginButton}>
              Login
            </button>
            <button onClick={handleRegister} className={styles.loginButton}>
              Register
            </button>
          </div>
        )}
      </header>

      <main className={styles.mainContent}>
        <section className={styles.quickStart}>
          <h2>Quick Start</h2>
          <button className={styles.playButton} onClick={handleCreateGame}>
            Create Private Game
          </button>
          <button className={styles.playButton} onClick={handleJoinGame}>
            Join Game
          </button>
        </section>

        <section className={styles.stats}>
          <h3>Your Statistics</h3>
          <div className={styles.statsGrid}>
            <StatItem title="Games Played" value="0" />
            <StatItem title="Wins" value="0" />
            <StatItem title="Total Money" value="$0" />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatItem({ title, value }: { title: string; value: string }) {
  return (
    <div className={styles.statItem}>
      <span className={styles.statTitle}>{title}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}
