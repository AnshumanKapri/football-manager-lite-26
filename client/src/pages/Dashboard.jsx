import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  const navigate = useNavigate();
  const userTeam = useGameStore(s => s.userTeam);
  const playerName = useGameStore(s => s.playerName);
  const currentWeek = useGameStore(s => s.currentWeek);
  const budget = useGameStore(s => s.budget);
  const squad = useGameStore(s => s.squad);
  const leagueTable = useGameStore(s => s.leagueTable);

  if (!userTeam) {
    navigate('/');
    return null;
  }

  const teamPosition = leagueTable.find(t => t.teamId === userTeam.id)?.position || '-';
  const nextFixture = { opponent: 'Chelsea', home: true };

  const stats = {
    avgRating: (squad.reduce((sum, p) => sum + p.overall, 0) / squad.length).toFixed(1),
    topScorer: squad.find(p => p.position.includes('ST'))?.name || 'N/A',
    totalValue: `€${(squad.reduce((sum, p) => sum + p.value, 0) / 1000000).toFixed(0)}M`,
    morale: 'Excellent'
  };

  const news = [
    { type: 'transfer', title: 'Transfer Interest', desc: 'European clubs monitoring your squad', time: '2h ago' },
    { type: 'injury', title: 'Fitness Report', desc: 'All players available for selection', time: '4h ago' },
    { type: 'match', title: 'Next Match Preview', desc: `vs ${nextFixture.opponent} this week`, time: '6h ago' },
    { type: 'finance', title: 'Financial Update', desc: 'Revenue projections positive', time: '1d ago' }
  ];

  return (
    <div className="dashboard-page">
      <Sidebar />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>MANAGER DASHBOARD</h1>
            <p>Welcome back, {playerName} | Week {currentWeek}</p>
          </div>
          <div className="header-right">
            <div className="team-badge" style={{ background: `linear-gradient(135deg, ${userTeam.color}, ${userTeam.secondaryColor})` }}>
              {userTeam.shortName}
            </div>
          </div>
        </header>

        <div className="quick-stats">
          <div className="stat-card glass-card neon-border">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <span className="stat-value">{teamPosition}</span>
              <span className="stat-label">League Position</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <span className="stat-value">€{(budget / 1000000).toFixed(1)}M</span>
              <span className="stat-label">Transfer Budget</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-value">{stats.avgRating}</span>
              <span className="stat-label">Team Rating</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon">💪</div>
            <div className="stat-info">
              <span className="stat-value">{stats.morale}</span>
              <span className="stat-label">Team Morale</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="portal-card glass-card next-match">
            <h3>⚡ NEXT MATCH</h3>
            <div className="match-preview">
              <div className="team-preview">
                <span className="team-name">{userTeam.name}</span>
                <span className="team-short">{userTeam.shortName}</span>
              </div>
              <div className="vs-badge">VS</div>
              <div className="team-preview">
                <span className="team-name">{nextFixture.opponent}</span>
                <span className="team-short">CHE</span>
              </div>
            </div>
            <button className="neon-btn" onClick={() => navigate('/matches')}>MATCH DAY</button>
          </div>

          <div className="portal-card glass-card squad-overview">
            <h3>👥 SQUAD</h3>
            <div className="squad-count">
              <span className="count-number">{squad.length}</span>
              <span className="count-label">Players</span>
            </div>
            <div className="squad-value">{stats.totalValue}</div>
            <button className="neon-btn neon-btn-outline" onClick={() => navigate('/squad')}>MANAGE</button>
          </div>

          <div className="portal-card glass-card league-standings">
            <h3>📊 LEAGUE TABLE</h3>
            <table className="mini-table">
              <thead>
                <tr><th>#</th><th>Team</th><th>P</th><th>GD</th><th>Pts</th></tr>
              </thead>
              <tbody>
                {leagueTable.slice(0, 5).map(team => (
                  <tr key={team.teamId} className={team.teamId === userTeam?.id ? 'active-row' : ''}>
                    <td>{team.position}</td>
                    <td>{team.shortName}</td>
                    <td>{team.played}</td>
                    <td>{team.goalDifference}</td>
                    <td className="points">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="neon-btn neon-btn-outline" onClick={() => navigate('/league')}>VIEW ALL</button>
          </div>

          <div className="portal-card glass-card news-feed">
            <h3>📰 NEWS</h3>
            <div className="news-list">
              {news.map((item, idx) => (
                <div key={idx} className="news-item">
                  <span className={`news-type ${item.type}`}>{item.type}</span>
                  <div className="news-content">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                  <span className="news-time">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="portal-card glass-card top-scorers">
            <h3>🥅 TOP SCORERS</h3>
            <div className="scorer-list">
              {squad.filter(p => p.position.includes('ST') || p.position.includes('LW') || p.position.includes('RW')).slice(0, 4).map((player, idx) => (
                <div key={player.id} className="scorer-item">
                  <span className="scorer-rank">{idx + 1}</span>
                  <div className="scorer-info">
                    <span className="scorer-name">{player.name}</span>
                    <span className="scorer-position">{player.position}</span>
                  </div>
                  <span className="scorer-rating">{player.overall}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="portal-card glass-card quick-actions">
            <h3>⚙️ QUICK ACTIONS</h3>
            <div className="actions-grid">
              <button className="action-btn glass-card" onClick={() => navigate('/tactics')}>
                <span>📋</span> Tactics
              </button>
              <button className="action-btn glass-card" onClick={() => navigate('/transfers')}>
                <span>🔄</span> Transfers
              </button>
              <button className="action-btn glass-card" onClick={() => navigate('/training')}>
                <span>🏋️</span> Training
              </button>
              <button className="action-btn glass-card" onClick={() => navigate('/finances')}>
                <span>💵</span> Finances
              </button>
              <button className="action-btn glass-card" onClick={() => navigate('/multiplayer')}>
                <span>🎮</span> Multiplayer
              </button>
              <button className="action-btn glass-card" onClick={() => navigate('/matches')}>
                <span>🎬</span> Matches
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
