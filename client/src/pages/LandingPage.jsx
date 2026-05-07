import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

function LandingPage() {
  const navigate = useNavigate();
  const setPlayerName = useGameStore(s => s.setPlayerName);
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
    }
  };

  return (
    <div className="landing-page">
      <div className="particles-bg">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>
      
      <div className="landing-content">
        <div className="logo-container">
          <div className="logo-glow" />
          <h1 className="logo-text">
            <span className="fm-text">FM</span>
            <span className="lite-text">LITE</span>
            <span className="year-text">26</span>
          </h1>
          <p className="tagline">Ultimate Football Manager Experience</p>
        </div>

        <div className="feature-cards">
          <div className="feature-card glass-card">
            <div className="feature-icon">⚽</div>
            <h3>Career Mode</h3>
            <p>Manage your dream team through seasons</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">🌐</div>
            <h3>Multiplayer</h3>
            <p>Challenge friends across networks</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Deep stats and performance insights</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">🏆</div>
            <h3>Competitions</h3>
            <p>Leagues, cups, and European glory</p>
          </div>
        </div>

        <div className="start-section">
          <input
            type="text"
            className="neon-input"
            placeholder="Enter Manager Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
          />
          <button className="neon-btn start-btn" onClick={handleStart}>
            START CAREER
          </button>
          <button 
            className="neon-btn neon-btn-outline" 
            onClick={() => navigate('/multiplayer')}
          >
            MULTIPLAYER
          </button>
        </div>

        <div className="version-info">
          <p>Powered by React + Socket.io | v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
