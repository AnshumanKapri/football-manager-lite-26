import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userTeam = useGameStore(s => s.userTeam);

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/squad', icon: '👥', label: 'Squad' },
    { path: '/tactics', icon: '📋', label: 'Tactics' },
    { path: '/transfers', icon: '🔄', label: 'Transfers' },
    { path: '/league', icon: '📊', label: 'League' },
    { path: '/matches', icon: '⚽', label: 'Matches' },
    { path: '/training', icon: '🏋️', label: 'Training' },
    { path: '/finances', icon: '💰', label: 'Finances' },
    { path: '/multiplayer', icon: '🎮', label: 'Multiplayer' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="fm-text">FM</span>
          <span className="lite-text">LITE</span>
        </div>
        {userTeam && (
          <div className="sidebar-team" style={{ background: `linear-gradient(135deg, ${userTeam.color}, ${userTeam.secondaryColor})` }}>
            {userTeam.shortName}
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={() => navigate('/')}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Exit</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
