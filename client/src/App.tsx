import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GamePage from "./pages/GamePage";
import GameSetupPage from "./pages/GameSetupPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<GameSetupPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
};

export default App;
