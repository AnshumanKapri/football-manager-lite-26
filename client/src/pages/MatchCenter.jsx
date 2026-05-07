import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import Sidebar from '../components/Sidebar';

function MatchCenter() {
  const navigate = useNavigate();
  const userTeam = useGameStore(s => s.userTeam);
  const fixtures = useGameStore(s => s.fixtures);
  const currentWeek = useGameStore(s => s.currentWeek);
  const [simulating, setSimulating] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const weekFixtures = fixtures.filter(f => f.week === currentWeek);
  const userFixture = weekFixtures.find(f => f.home?.id === userTeam?.id || f.away?.id === userTeam?.id);

  const simulateMatch = () => {
    setSimulating(true);
    const homeStrength = userFixture.home?.rating || 80;
    const awayStrength = userFixture.away?.rating || 80;
    const homeAdvantage = 5;
    
    const homeGoals = Math.floor(Math.random() * 4 + (homeStrength + homeAdvantage) / 40);
    const awayGoals = Math.floor(Math.random() * 4 + awayStrength / 40);
    
    setMatchResult({ home: homeGoals, away: awayGoals });
    setSimulating(false);
  };

  const playLiveMatch = () => {
    navigate('/live-match');
  };

  return (
    <div className="matches-page">
      <Sidebar />
      <main className="matches-content">
        <header className="page-header">
          <h1>MATCH CENTER</h1>
          <p>Week {currentWeek} | {userFixture ? `${userFixture.home?.name} vs ${userFixture.away?.name}` : 'No fixture'}</p>
        </header>

        {userFixture && (
          <div className="match-preview-card glass-card">
            <h3>YOUR NEXT MATCH</h3>
            <div className="match-display">
              <div className="match-team">
                <span className="team-name-large">{userFixture.home?.name}</span>
                <span className="team-short-large">{userFixture.home?.shortName}</span>
              </div>
              <div className="match-vs">
                {matchResult ? (
                  <span className="match-score">{matchResult.home} - {matchResult.away}</span>
                ) : (
                  <span className="vs-text">VS</span>
                )}
                <span className="match-time">Week {currentWeek}</span>
              </div>
              <div className="match-team">
                <span className="team-name-large">{userFixture.away?.name}</span>
                <span className="team-short-large">{userFixture.away?.shortName}</span>
              </div>
            </div>
            <div className="match-actions">
              <button className="neon-btn" onClick={playLiveMatch}>
                ⚽ PLAY LIVE MATCH
              </button>
              <button className="neon-btn neon-btn-secondary" onClick={simulateMatch} disabled={simulating}>
                🎲 QUICK SIMULATE
              </button>
            </div>
          </div>
        )}

        <div className="fixtures-list glass-card">
          <h3>WEEK {currentWeek} FIXTURES</h3>
          <div className="fixtures-scroll">
            {weekFixtures.map((fixture, idx) => (
              <div key={idx} className={`fixture-item ${fixture.home?.id === userTeam?.id || fixture.away?.id === userTeam?.id ? 'highlighted' : ''}`}>
                <span className="fixture-home">{fixture.home?.name}</span>
                <span className="fixture-score">
                  {fixture.played ? `${fixture.score?.home} - ${fixture.score?.away}` : 'vs'}
                </span>
                <span className="fixture-away">{fixture.away?.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MatchCenter;
