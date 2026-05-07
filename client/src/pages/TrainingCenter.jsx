import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import Sidebar from '../components/Sidebar';

function TrainingCenter() {
  const squad = useGameStore(s => s.squad);
  const trainingFocus = useGameStore(s => s.trainingFocus);
  const setTrainingFocus = useGameStore(s => s.setTrainingFocus);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [trainingPlan, setTrainingPlan] = useState({
    intensity: 70,
    duration: 60,
    focus: 'overall'
  });

  const trainingDrills = [
    { name: 'Pace & Agility', icon: '🏃', attribute: 'pace', desc: 'Improve sprint speed and agility' },
    { name: 'Shooting Practice', icon: '🎯', attribute: 'shooting', desc: 'Work on finishing and shot power' },
    { name: 'Passing Drills', icon: '🎯', attribute: 'passing', desc: 'Enhance passing accuracy and vision' },
    { name: 'Dribbling Course', icon: '⚡', attribute: 'dribbling', desc: 'Ball control and close dribbling' },
    { name: 'Defensive Shape', icon: '🛡️', attribute: 'defending', desc: 'Positioning and tackling' },
    { name: 'Gym Session', icon: '💪', attribute: 'physical', desc: 'Strength and stamina training' }
  ];

  return (
    <div className="training-page">
      <Sidebar />
      <main className="training-content">
        <header className="page-header">
          <h1>TRAINING CENTER</h1>
          <p>Develop your players to reach their potential</p>
        </header>

        <div className="training-grid">
          <div className="training-panel glass-card">
            <h3>📋 TRAINING SCHEDULE</h3>
            <div className="intensity-control">
              <label>Training Intensity</label>
              <input
                type="range"
                min="0"
                max="100"
                value={trainingPlan.intensity}
                onChange={e => setTrainingPlan({ ...trainingPlan, intensity: parseInt(e.target.value) })}
                className="neon-slider"
              />
              <span>{trainingPlan.intensity}%</span>
            </div>
            <div className="duration-control">
              <label>Session Duration (minutes)</label>
              <input
                type="range"
                min="30"
                max="120"
                value={trainingPlan.duration}
                onChange={e => setTrainingPlan({ ...trainingPlan, duration: parseInt(e.target.value) })}
                className="neon-slider"
              />
              <span>{trainingPlan.duration} min</span>
            </div>
            <div className="focus-select">
              <label>Weekly Focus</label>
              <select
                value={trainingFocus}
                onChange={e => setTrainingFocus(e.target.value)}
                className="neon-input"
              >
                <option value="overall">Overall Development</option>
                <option value="pace">Pace & Speed</option>
                <option value="shooting">Shooting</option>
                <option value="passing">Passing</option>
                <option value="dribbling">Dribbling</option>
                <option value="defending">Defending</option>
                <option value="physical">Physical</option>
              </select>
            </div>
          </div>

          <div className="training-panel glass-card drills-panel">
            <h3>🎯 TRAINING DRILLS</h3>
            <div className="drills-grid">
              {trainingDrills.map(drill => (
                <div key={drill.name} className="drill-card glass-card">
                  <span className="drill-icon">{drill.icon}</span>
                  <h4>{drill.name}</h4>
                  <p>{drill.desc}</p>
                  <button className="neon-btn">START</button>
                </div>
              ))}
            </div>
          </div>

          <div className="training-panel glass-card players-panel">
            <h3>👥 SQUAD DEVELOPMENT</h3>
            <div className="development-list">
              {squad.slice(0, 10).map(player => {
                const potentialGain = player.potential - player.overall;
                return (
                  <div key={player.id} className="development-item glass-card">
                    <div className="player-header">
                      <span className="player-name">{player.name}</span>
                      <span className="player-position">{player.position}</span>
                    </div>
                    <div className="development-bars">
                      <div className="dev-bar">
                        <span>OVR</span>
                        <div className="bar-bg">
                          <div className="bar-fill" style={{ width: `${player.overall}%`, background: getOverallColor(player.overall) }} />
                        </div>
                        <span>{player.overall}</span>
                      </div>
                      <div className="dev-bar">
                        <span>POT</span>
                        <div className="bar-bg">
                          <div className="bar-fill" style={{ width: `${player.potential}%`, background: 'var(--neon-green)' }} />
                        </div>
                        <span>{player.potential}</span>
                      </div>
                    </div>
                    <span className="growth-potential">+{potentialGain} growth</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function getOverallColor(rating) {
  if (rating >= 90) return 'var(--neon-green)';
  if (rating >= 85) return 'var(--neon-primary)';
  if (rating >= 80) return 'var(--neon-accent)';
  return 'var(--neon-orange)';
}

export default TrainingCenter;
