import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Import the useAuth hook
import styles from "../styles/AuthPages.module.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    try {
      const result = await login(username, password);
  
      if (!result.success) {
        throw new Error(result.error || "Login failed");
      }
  
      // !!! FOARTE IMPORTANT: user este updatat automat de useAuth după login.
      if (result.success && result.user?.rol === "ADMINISTRATOR") {
        navigate("/leaderboard");
      } else {
        navigate("/");
      }
      
  
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>Monopoly Empire</h1>
        </div>

        <h2 className={styles.title}>Login</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={styles.loginEyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.linkContainer}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
