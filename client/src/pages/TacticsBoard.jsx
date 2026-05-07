import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import Sidebar from '../components/Sidebar';

const FORMATIONS = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '4-1-4-1', '3-4-3', '5-3-2'];

function TacticsBoard() {
  const tactics = useGameStore(s => s.tactics);
  const setFormation = useGameStore(s => s.setFormation);
  const updateTactics = useGameStore(s => s.updateTactics);

  return (
    <div className="tactics-page">
      <Sidebar />
      <main className="tactics-content">
        <header className="page-header">
          <h1>TACTICS BOARD</h1>
          <p>Customize your playing style</p>
        </header>

        <div className="tactics-grid">
          <div className="tactics-panel glass-card formation-selector">
            <h3>FORMATION</h3>
            <div className="formation-buttons">
              {FORMATIONS.map(f => (
                <button
                  key={f}
                  className={`formation-btn ${tactics.formation === f ? 'active' : ''}`}
                  onClick={() => setFormation(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="formation-visual">
              <div className="mini-pitch">
                {getFormationDots(tactics.formation).map((pos, idx) => (
                  <div key={idx} className="tactic-dot" style={{ top: pos.top, left: pos.left }} />
                ))}
              </div>
            </div>
          </div>

          <div className="tactics-panel glass-card mentality-settings">
            <h3>TEAM MENTALITY</h3>
            <div className="mentality-buttons">
              {['Ultra Defensive', 'Defensive', 'Balanced', 'Attacking', 'Ultra Attacking'].map(m => (
                <button
                  key={m}
                  className={`mentality-btn ${tactics.mentality === m.toLowerCase() ? 'active' : ''}`}
                  onClick={() => updateTactics({ mentality: m.toLowerCase() })}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="tactics-panel glass-card sliders-panel">
            <h3>TACTICAL SLIDERS</h3>
            <div className="slider-group">
              <label>Attacking Width</label>
              <input
                type="range"
                min="0"
                max="100"
                value={tactics.width}
                onChange={e => updateTactics({ width: parseInt(e.target.value) })}
                className="neon-slider"
              />
              <span className="slider-value">{tactics.width}</span>
            </div>
            <div className="slider-group">
              <label>Defensive Depth</label>
              <input
                type="range"
                min="0"
                max="100"
                value={tactics.depth}
                onChange={e => updateTactics({ depth: parseInt(e.target.value) })}
                className="neon-slider"
              />
              <span className="slider-value">{tactics.depth}</span>
            </div>
            <div className="slider-group">
              <label>Pressing Intensity</label>
              <input
                type="range"
                min="0"
                max="100"
                value={tactics.pressingIntensity}
                onChange={e => updateTactics({ pressingIntensity: parseInt(e.target.value) })}
                className="neon-slider"
              />
              <span className="slider-value">{tactics.pressingIntensity}</span>
            </div>
            <div className="slider-group">
              <label>Tempo</label>
              <input
                type="range"
                min="0"
                max="100"
                value={tactics.attackingMentality}
                onChange={e => updateTactics({ attackingMentality: parseInt(e.target.value) })}
                className="neon-slider"
              />
              <span className="slider-value">{tactics.attackingMentality}</span>
            </div>
          </div>

          <div className="tactics-panel glass-card instructions-panel">
            <h3>PLAYER INSTRUCTIONS</h3>
            <div className="instruction-row">
              <span>Fullbacks</span>
              <select className="neon-input">
                <option>Stay Back</option>
                <option>Overlap</option>
                <option>Inverted</option>
              </select>
            </div>
            <div className="instruction-row">
              <span>Strikers</span>
              <select className="neon-input">
                <option>Stay Central</option>
                <option>Drift Wide</option>
                <option>Press Back Line</option>
              </select>
            </div>
            <div className="instruction-row">
              <span>Midfielders</span>
              <select className="neon-input">
                <option>Hold Position</option>
                <option>Box to Box</option>
                <option>Get Forward</option>
              </select>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function getFormationDots(formation) {
  const formations = {
    '4-3-3': [{top:'90%',left:'50%'},{top:'75%',left:'15%'},{top:'75%',left:'38%'},{top:'75%',left:'62%'},{top:'75%',left:'85%'},{top:'50%',left:'30%'},{top:'50%',left:'50%'},{top:'50%',left:'70%'},{top:'25%',left:'20%'},{top:'20%',left:'50%'},{top:'25%',left:'80%'}],
    '4-4-2': [{top:'90%',left:'50%'},{top:'75%',left:'15%'},{top:'75%',left:'38%'},{top:'75%',left:'62%'},{top:'75%',left:'85%'},{top:'50%',left:'15%'},{top:'50%',left:'38%'},{top:'50%',left:'62%'},{top:'50%',left:'85%'},{top:'25%',left:'35%'},{top:'25%',left:'65%'}],
    '4-2-3-1': [{top:'90%',left:'50%'},{top:'75%',left:'15%'},{top:'75%',left:'38%'},{top:'75%',left:'62%'},{top:'75%',left:'85%'},{top:'55%',left:'35%'},{top:'55%',left:'65%'},{top:'38%',left:'20%'},{top:'35%',left:'50%'},{top:'38%',left:'80%'},{top:'20%',left:'50%'}],
    '3-5-2': [{top:'90%',left:'50%'},{top:'75%',left:'25%'},{top:'75%',left:'50%'},{top:'75%',left:'75%'},{top:'50%',left:'10%'},{top:'50%',left:'30%'},{top:'50%',left:'50%'},{top:'50%',left:'70%'},{top:'50%',left:'90%'},{top:'25%',left:'35%'},{top:'25%',left:'65%'}],
    '4-1-4-1': [{top:'90%',left:'50%'},{top:'75%',left:'15%'},{top:'75%',left:'38%'},{top:'75%',left:'62%'},{top:'75%',left:'85%'},{top:'60%',left:'50%'},{top:'40%',left:'15%'},{top:'40%',left:'38%'},{top:'40%',left:'62%'},{top:'40%',left:'85%'},{top:'20%',left:'50%'}],
    '3-4-3': [{top:'90%',left:'50%'},{top:'75%',left:'25%'},{top:'75%',left:'50%'},{top:'75%',left:'75%'},{top:'50%',left:'15%'},{top:'50%',left:'38%'},{top:'50%',left:'62%'},{top:'50%',left:'85%'},{top:'25%',left:'20%'},{top:'20%',left:'50%'},{top:'25%',left:'80%'}],
    '5-3-2': [{top:'90%',left:'50%'},{top:'75%',left:'10%'},{top:'75%',left:'30%'},{top:'75%',left:'50%'},{top:'75%',left:'70%'},{top:'75%',left:'90%'},{top:'50%',left:'25%'},{top:'50%',left:'50%'},{top:'50%',left:'75%'},{top:'25%',left:'35%'},{top:'25%',left:'65%'}]
  };
  return formations[formation] || formations['4-3-3'];
}

export default TacticsBoard;
