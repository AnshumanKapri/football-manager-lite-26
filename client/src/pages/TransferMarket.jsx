import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import Sidebar from '../components/Sidebar';
import PlayerCard from '../components/PlayerCard';
import { PLAYERS } from '../data/players';

function TransferMarket() {
  const budget = useGameStore(s => s.budget);
  const buyPlayer = useGameStore(s => s.buyPlayer);
  const squad = useGameStore(s => s.squad);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('overall');

  const allPlayers = Object.values(PLAYERS);
  const availablePlayers = allPlayers.filter(p => !squad.find(s => s.id === p.id));

  const filtered = availablePlayers
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.position.toLowerCase().includes(search.toLowerCase()))
    .filter(p => filter === 'all' || p.position.includes(filter))
    .sort((a, b) => {
      if (sortBy === 'overall') return b.overall - a.overall;
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'age') return a.age - b.age;
      if (sortBy === 'pace') return b.attributes.pace - a.attributes.pace;
      return 0;
    });

  return (
    <div className="transfers-page">
      <Sidebar />
      <main className="transfers-content">
        <header className="page-header">
          <h1>TRANSFER MARKET</h1>
          <p>Budget: <span className="neon-text-green">€{(budget / 1000000).toFixed(1)}M</span></p>
        </header>

        <div className="transfer-controls glass-card">
          <input
            type="text"
            className="neon-input"
            placeholder="Search players..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="filter-group">
            <select value={filter} onChange={e => setFilter(e.target.value)} className="neon-input">
              <option value="all">All Positions</option>
              <option value="GK">Goalkeeper</option>
              <option value="CB">Center Back</option>
              <option value="RB">Right Back</option>
              <option value="LB">Left Back</option>
              <option value="CDM">Defensive Mid</option>
              <option value="CM">Midfielder</option>
              <option value="CAM">Attacking Mid</option>
              <option value="LW">Left Wing</option>
              <option value="RW">Right Wing</option>
              <option value="ST">Striker</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="neon-input">
              <option value="overall">Sort: Overall</option>
              <option value="value">Sort: Value</option>
              <option value="age">Sort: Age</option>
              <option value="pace">Sort: Pace</option>
            </select>
          </div>
        </div>

        <div className="transfer-grid">
          {filtered.map(player => (
            <div key={player.id} className="transfer-card-wrapper">
              <PlayerCard player={player} showActions />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TransferMarket;
