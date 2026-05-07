import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TeamSelect from './pages/TeamSelect';
import Dashboard from './pages/Dashboard';
import SquadManagement from './pages/SquadManagement';
import TacticsBoard from './pages/TacticsBoard';
import TransferMarket from './pages/TransferMarket';
import LeagueView from './pages/LeagueView';
import MatchCenter from './pages/MatchCenter';
import TrainingCenter from './pages/TrainingCenter';
import Finances from './pages/Finances';
import MultiplayerLobby from './pages/MultiplayerLobby';
import LiveMatch from './pages/LiveMatch';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/team-select" element={<TeamSelect />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/squad" element={<SquadManagement />} />
      <Route path="/tactics" element={<TacticsBoard />} />
      <Route path="/transfers" element={<TransferMarket />} />
      <Route path="/league" element={<LeagueView />} />
      <Route path="/matches" element={<MatchCenter />} />
      <Route path="/training" element={<TrainingCenter />} />
      <Route path="/finances" element={<Finances />} />
      <Route path="/multiplayer" element={<MultiplayerLobby />} />
      <Route path="/live-match" element={<LiveMatch />} />
    </Routes>
  );
}

export default App;
