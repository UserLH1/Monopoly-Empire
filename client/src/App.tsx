import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GamePage from "./pages/GamePage";
import GameSetupPage from "./pages/GameSetupPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/setup"
          element={
            <ProtectedRoute>
              <GameSetupPage />
            </ProtectedRoute>
          }
        />
        <Route path="/game" element={<GamePage />} />{" "}
        {/* Already protected in GamePage component */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
