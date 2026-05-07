import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { TEAMS } from '../data/leagues';

function TeamSelect() {
  const navigate = useNavigate();
  const selectTeam = useGameStore(s => s.selectTeam);
  const playerName = useGameStore(s => s.playerName);

  return (
    <div className="team-select-page">
      <header className="page-header">
        <h1>SELECT YOUR CLUB</h1>
        <p>Welcome, Manager {playerName}</p>
      </header>

      <div className="teams-grid">
        {TEAMS.map(team => (
          <div key={team.id} className="team-card glass-card" onClick={() => selectTeam(team.id)}>
            <div className="team-card-header" style={{ background: `linear-gradient(135deg, ${team.color}, ${team.secondaryColor})` }}>
              <span className="team-logo">{team.logo || '⚽'}</span>
              <span className="team-rating">{team.rating}</span>
            </div>
            <div className="team-card-body">
              <h3>{team.name}</h3>
              <p className="team-league">{team.league.toUpperCase()}</p>
              <div className="team-stats">
                <span>Budget: €{(team.budget / 1000000).toFixed(0)}M</span>
                <span>Stadium: {team.stadium}</span>
              </div>
            </div>
            <div className="team-card-footer">
              <span className="select-text">Click to Select</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamSelect;
