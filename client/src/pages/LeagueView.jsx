import { useGameStore } from '../store/gameStore';
import Sidebar from '../components/Sidebar';

function LeagueView() {
  const leagueTable = useGameStore(s => s.leagueTable);
  const userTeam = useGameStore(s => s.userTeam);

  return (
    <div className="league-page">
      <Sidebar />
      <main className="league-content">
        <header className="page-header">
          <h1>LEAGUE STANDINGS</h1>
          <p>Premier League 2025/26</p>
        </header>

        <div className="league-table-container glass-card">
          <table className="league-table">
            <thead>
              <tr>
                <th>POS</th>
                <th>TEAM</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>PTS</th>
                <th>FORM</th>
              </tr>
            </thead>
            <tbody>
              {leagueTable.map((team, idx) => (
                <tr key={team.teamId} className={`
                  ${team.teamId === userTeam?.id ? 'user-team-row' : ''}
                  ${idx < 4 ? 'champions-league' : ''}
                  ${idx >= leagueTable.length - 3 ? 'relegation' : ''}
                `}>
                  <td className="position-cell">
                    <span className={`pos-badge ${idx < 4 ? 'cl' : idx >= leagueTable.length - 3 ? 'rel' : ''}`}>
                      {team.position}
                    </span>
                  </td>
                  <td className="team-cell">
                    <span className="team-name">{team.teamName}</span>
                  </td>
                  <td>{team.played}</td>
                  <td>{team.won}</td>
                  <td>{team.drawn}</td>
                  <td>{team.lost}</td>
                  <td>{team.goalsFor}</td>
                  <td>{team.goalsAgainst}</td>
                  <td className={team.goalDifference > 0 ? 'positive' : team.goalDifference < 0 ? 'negative' : ''}>
                    {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                  </td>
                  <td className="points-cell">{team.points}</td>
                  <td className="form-cell">
                    {team.form.map((result, i) => (
                      <span key={i} className={`form-badge ${result}`}>
                        {result === 'W' ? 'W' : result === 'D' ? 'D' : 'L'}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-dot cl" /> Champions League
          </div>
          <div className="legend-item">
            <span className="legend-dot rel" /> Relegation Zone
          </div>
        </div>
      </main>
    </div>
  );
}

export default LeagueView;
