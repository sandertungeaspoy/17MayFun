import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import StartScreen from './pages/StartScreen';
import PriceWheelPage from './pages/PriceWheelPage';
import PunishmentWheelPage from './pages/PunishmentWheelPage';
import RulesWheelPage from './pages/RulesWheelPage';
import MusicBingoPage from './pages/MusicBingoPage';
import QuizPage from './pages/QuizPage';
import { RoutePath } from './types';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <Router>
          <div className="main-content">
            <Routes>
              <Route path={RoutePath.HOME} element={<StartScreen />} />
              <Route path={RoutePath.PRICE_WHEEL} element={<PriceWheelPage />} />
              <Route path={RoutePath.PUNISHMENT_WHEEL} element={<PunishmentWheelPage />} />
              <Route path={RoutePath.RULES_WHEEL} element={<RulesWheelPage />} />
              <Route path={RoutePath.MUSIC_BINGO} element={<MusicBingoPage />} />
              <Route path={RoutePath.QUIZ} element={<QuizPage />} />
              <Route path={`${RoutePath.QUIZ}/:quizId`} element={<QuizPage />} />
            </Routes>
          </div>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
