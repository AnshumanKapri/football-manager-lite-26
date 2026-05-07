import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function LiveMatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [minute, setMinute] = useState(0);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    home: { possession: 50, shots: 0, shotsOnTarget: 0, corners: 0, fouls: 0, passes: 0 },
    away: { possession: 50, shots: 0, shotsOnTarget: 0, corners: 0, fouls: 0, passes: 0 }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [matchFinished, setMatchFinished] = useState(false);
  const [goalFlash, setGoalFlash] = useState(false);

  const homeTeam = location.state?.homeTeam || { name: 'Arsenal', shortName: 'ARS', color: '#EF0107' };
  const awayTeam = location.state?.awayTeam || { name: 'Chelsea', shortName: 'CHE', color: '#034694' };

  const matchEvents = [
    { type: 'shot', descriptions: ['Shot goes wide!', 'Great save by the goalkeeper!', 'Shot blocked!', 'Close! Just over the bar!'] },
    { type: 'corner', descriptions: ['Corner kick awarded!', 'Corner for the home team!', 'Dangerous corner incoming!'] },
    { type: 'foul', descriptions: ['Foul in midfield!', 'Late challenge!', 'Tactical foul to stop the counter!'] },
    { type: 'keypass', descriptions: ['Dangerous attack building!', 'Quick passing sequence!', 'Brilliant through ball!'] },
    { type: 'save', descriptions: ['Spectacular save!', 'Keeper denies the effort!', 'Fingertip save!'] }
  ];

  useEffect(() => {
    if (isPlaying && minute < 90 && !matchFinished) {
      const interval = setInterval(() => {
        setMinute(prev => {
          if (prev >= 90) {
            setMatchFinished(true);
            setIsPlaying(false);
            return 90;
          }
          simulateMinute(prev + 1);
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isPlaying, minute, matchFinished]);

  const simulateMinute = (min) => {
    const rand = Math.random();
    
    // Goal chance (small probability)
    if (rand < 0.08) {
      const isHome = Math.random() > 0.5;
      setScore(prev => ({ ...prev, [isHome ? 'home' : 'away']: prev[isHome ? 'home' : 'away'] + 1 }));
      setGoalFlash(true);
      setTimeout(() => setGoalFlash(false), 2000);
      
      const scorers = ['Star Player', 'Top Striker', 'Midfield Maestro', 'Winger Wizard'];
      const scorer = scorers[Math.floor(Math.random() * scorers.length)];
      const event = {
        minute: min,
        type: 'goal',
        team: isHome ? 'home' : 'away',
        description: `⚽ GOAL! ${isHome ? homeTeam.name : awayTeam.name} - ${scorer} scores!`,
        time: `${min}'`
      };
      setEvents(prev => [event, ...prev]);
      return;
    }

    // Shot
    if (rand < 0.25) {
      const isHome = Math.random() > 0.5;
      const shotEvent = matchEvents[0];
      setEvents(prev => [{
        minute: min,
        type: 'shot',
        team: isHome ? 'home' : 'away',
        description: `${isHome ? homeTeam.name : awayTeam.name} - ${shotEvent.descriptions[Math.floor(Math.random() * shotEvent.descriptions.length)]}`,
        time: `${min}'`
      }, ...prev]);
    }

    // Other events
    if (rand > 0.5) {
      const isHome = Math.random() > 0.5;
      const eventType = matchEvents[Math.floor(Math.random() * matchEvents.length)];
      setEvents(prev => [{
        minute: min,
        type: eventType.type,
        team: isHome ? 'home' : 'away',
        description: `${isHome ? homeTeam.name : awayTeam.name} - ${eventType.descriptions[Math.floor(Math.random() * eventType.descriptions.length)]}`,
        time: `${min}'`
      }, ...prev]);
    }

    // Update stats
    setStats(prev => ({
      home: {
        ...prev.home,
        possession: 45 + Math.floor(Math.random() * 10),
        shots: prev.shots + (rand < 0.25 ? 1 : 0),
        passes: prev.passes + Math.floor(Math.random() * 8 + 3)
      },
      away: {
        ...prev.away,
        possession: 55 - Math.floor(Math.random() * 10),
        shots: prev.shots + (rand >= 0.25 ? 1 : 0),
        passes: prev.passes + Math.floor(Math.random() * 8 + 3)
      }
    }));
  };

  const startMatch = () => setIsPlaying(true);
  const simulateFull = () => {
    for (let i = minute; i <= 90; i++) {
      simulateMinute(i);
    }
    setMinute(90);
    setMatchFinished(true);
  };

  return (
    <div className={`live-match-page ${goalFlash ? 'goal-flash' : ''}`}>
      <header className="match-header">
        <button className="back-btn" onClick={() => navigate('/matches')}>← Back</button>
        <h2>
          <span style={{ color: homeTeam.color }}>{homeTeam.name}</span>
          {' '}vs{' '}
          <span style={{ color: awayTeam.color }}>{awayTeam.name}</span>
        </h2>
        <div className="match-timer">
          <span className={`timer ${isPlaying ? 'pulsing' : ''}`}>{minute}'</span>
        </div>
      </header>

      <div className="scoreboard">
        <div className="score-team home">
          <span className="team-abbr">{homeTeam.shortName}</span>
        </div>
        <div className="score-display">
          <span className="score home-score">{score.home}</span>
          <span className="score-divider">-</span>
          <span className="score away-score">{score.away}</span>
        </div>
        <div className="score-team away">
          <span className="team-abbr">{awayTeam.shortName}</span>
        </div>
      </div>

      <div className="match-controls">
        {!isPlaying && !matchFinished && (
          <button className="neon-btn" onClick={startMatch}>▶ START MATCH</button>
        )}
        {!matchFinished && (
          <button className="neon-btn neon-btn-secondary" onClick={simulateFull}>⏩ SIMULATE FULL MATCH</button>
        )}
      </div>

      <div className="match-content">
        <div className="commentary-panel glass-card">
          <h3>📢 LIVE COMMENTARY</h3>
          <div className="commentary-feed">
            {events.map((event, idx) => (
              <div key={idx} className={`commentary-item ${event.type === 'goal' ? 'goal-event' : ''}`}>
                <span className="commentary-time">{event.time}</span>
                <span className={`commentary-type ${event.type}`}>
                  {event.type === 'goal' ? '⚽' : event.type === 'shot' ? '🎯' : event.type === 'corner' ? '🚩' : event.type === 'foul' ? '🟨' : '📊'}
                </span>
                <span className="commentary-text">{event.description}</span>
              </div>
            ))}
            {events.length === 0 && (
              <p className="waiting-text">Waiting for kick-off...</p>
            )}
          </div>
        </div>

        <div className="stats-panel glass-card">
          <h3>📊 MATCH STATS</h3>
          <div className="stat-row">
            <span>{stats.home.possession}%</span>
            <span>Possession</span>
            <span>{stats.away.possession}%</span>
          </div>
          <div className="stat-row">
            <span>{stats.home.shots}</span>
            <span>Shots</span>
            <span>{stats.away.shots}</span>
          </div>
          <div className="stat-row">
            <span>{stats.home.shotsOnTarget}</span>
            <span>On Target</span>
            <span>{stats.away.shotsOnTarget}</span>
          </div>
          <div className="stat-row">
            <span>{stats.home.corners}</span>
            <span>Corners</span>
            <span>{stats.away.corners}</span>
          </div>
          <div className="stat-row">
            <span>{stats.home.fouls}</span>
            <span>Fouls</span>
            <span>{stats.away.fouls}</span>
          </div>
          <div className="stat-row">
            <span>{stats.home.passes}</span>
            <span>Passes</span>
            <span>{stats.away.passes}</span>
          </div>
        </div>
      </div>

      {matchFinished && (
        <div className="full-time-overlay">
          <div className="full-time-card glass-card">
            <h2>FULL TIME</h2>
            <div className="final-score">
              <span>{homeTeam.shortName}</span>
              <span className="score-final">{score.home} - {score.away}</span>
              <span>{awayTeam.shortName}</span>
            </div>
            <button className="neon-btn" onClick={() => navigate('/dashboard')}>RETURN TO DASHBOARD</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveMatch;
