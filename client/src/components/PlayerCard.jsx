import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

function PlayerCard({ player, compact = false, showActions = false, size = 'standard' }) {
  const [hovered, setHovered] = useState(false);
  const buyPlayer = useGameStore(s => s.buyPlayer);
  const budget = useGameStore(s => s.budget);

  const getOverallColor = (rating) => {
    if (rating >= 90) return '#00ff88';
    if (rating >= 85) return '#00d4ff';
    if (rating >= 80) return '#a855f7';
    if (rating >= 75) return '#ffaa00';
    return '#888888';
  };

  const getCardGradient = (rating) => {
    if (rating >= 90) return 'linear-gradient(135deg, #0a2a1a 0%, #0d3d28 30%, #114d33 60%, #0a3020 100%)';
    if (rating >= 85) return 'linear-gradient(135deg, #0a1a2a 0%, #0d2d4d 30%, #114066 60%, #0a2840 100%)';
    if (rating >= 80) return 'linear-gradient(135deg, #1a0a2a 0%, #2d1140 30%, #401a55 60%, #2a1035 100%)';
    if (rating >= 75) return 'linear-gradient(135deg, #2a1a0a 0%, #4d2d11 30%, #66401a 60%, #402810 100%)';
    return 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 30%, #404040 60%, #2a2a2a 100%)';
  };

  const getCardBorder = (rating) => {
    if (rating >= 90) return 'linear-gradient(180deg, #00ff88, #00cc6a, #009950, #00ff88)';
    if (rating >= 85) return 'linear-gradient(180deg, #00d4ff, #00a3cc, #0080b3, #00d4ff)';
    if (rating >= 80) return 'linear-gradient(180deg, #a855f7, #8b3ed4, #7030b0, #a855f7)';
    if (rating >= 75) return 'linear-gradient(180deg, #ffaa00, #cc8800, #996600, #ffaa00)';
    return 'linear-gradient(180deg, #888, #666, #444, #888)';
  };

  const getGlowColor = (rating) => {
    if (rating >= 90) return 'rgba(0, 255, 136, 0.6)';
    if (rating >= 85) return 'rgba(0, 212, 255, 0.6)';
    if (rating >= 80) return 'rgba(168, 85, 247, 0.6)';
    return 'rgba(255, 170, 0, 0.4)';
  };

  const overallColor = getOverallColor(player.overall);
  const cardGradient = getCardGradient(player.overall);
  const cardBorder = getCardBorder(player.overall);
  const glowColor = getGlowColor(player.overall);

  const cardScale = size === 'large' ? 1.3 : size === 'small' ? 0.8 : 1;

  if (compact) {
    return (
      <div
        className="fifa-compact-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="compact-rating" style={{ color: overallColor }}>
          {player.overall}
        </div>
        <div className="compact-pos" style={{ color: overallColor }}>
          {player.position}
        </div>
        <div className="compact-name">{player.name}</div>
        <div className="compact-stats">
          <div className="compact-stat">
            <span className="stat-val" style={{ color: player.attributes.pace >= 80 ? overallColor : '#888' }}>
              {player.attributes.pace}
            </span>
            <span className="stat-lbl">PAC</span>
          </div>
          <div className="compact-stat">
            <span className="stat-val" style={{ color: player.attributes.shooting >= 80 ? overallColor : '#888' }}>
              {player.attributes.shooting}
            </span>
            <span className="stat-lbl">SHO</span>
          </div>
          <div className="compact-stat">
            <span className="stat-val" style={{ color: player.attributes.passing >= 80 ? overallColor : '#888' }}>
              {player.attributes.passing}
            </span>
            <span className="stat-lbl">PAS</span>
          </div>
          <div className="compact-stat">
            <span className="stat-val" style={{ color: player.attributes.dribbling >= 80 ? overallColor : '#888' }}>
              {player.attributes.dribbling}
            </span>
            <span className="stat-lbl">DRI</span>
          </div>
          <div className="compact-stat">
            <span className="stat-val" style={{ color: player.attributes.defending >= 80 ? overallColor : '#888' }}>
              {player.attributes.defending}
            </span>
            <span className="stat-lbl">DEF</span>
          </div>
          <div className="compact-stat">
            <span className="stat-val" style={{ color: player.attributes.physical >= 80 ? overallColor : '#888' }}>
              {player.attributes.physical}
            </span>
            <span className="stat-lbl">PHY</span>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'PAC', value: player.attributes.pace },
    { label: 'DRI', value: player.attributes.dribbling },
    { label: 'SHO', value: player.attributes.shooting },
    { label: 'DEF', value: player.attributes.defending },
    { label: 'PAS', value: player.attributes.passing },
    { label: 'PHY', value: player.attributes.physical }
  ];

  return (
    <div
      className="fifa-ut-card-container"
      style={{ transform: `scale(${cardScale})`, transformOrigin: 'center top' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="fifa-ut-card"
        style={{
          background: cardGradient,
          borderColor: overallColor,
          boxShadow: hovered
            ? `0 0 40px ${glowColor}, 0 0 80px ${glowColor}, inset 0 0 30px rgba(0,0,0,0.3)`
            : `0 0 20px ${glowColor}, inset 0 0 20px rgba(0,0,0,0.3)`
        }}
      >
        {/* Card border glow effect */}
        <div className="card-border-glow" style={{ background: cardBorder }} />
        
        {/* Card top section - rating & position */}
        <div className="card-top-section">
          <div className="card-rating-block">
            <div className="card-rating-number" style={{ color: overallColor }}>
              {player.overall}
            </div>
            <div className="card-position" style={{ color: overallColor }}>
              {player.position}
            </div>
            <div className="card-nation-flag">
              {player.nationality === 'England' ? '🏴' :
               player.nationality === 'Brazil' ? '🇧🇷' :
               player.nationality === 'France' ? '🇫🇷' :
               player.nationality === 'Spain' ? '🇪🇸' :
               player.nationality === 'Germany' ? '🇩🇪' :
               player.nationality === 'Argentina' ? '🇦🇷' :
               player.nationality === 'Portugal' ? '🇵🇹' :
               player.nationality === 'Netherlands' ? '🇳🇱' :
               player.nationality === 'Italy' ? '🇮🇹' :
               player.nationality === 'Belgium' ? '🇧🇪' :
               player.nationality === 'Norway' ? '🇳🇴' :
               player.nationality === 'Egypt' ? '🇪🇬' :
               player.nationality === 'Hungary' ? '🇭🇺' :
               player.nationality === 'Uruguay' ? '🇺🇾' :
               player.nationality === 'Scotland' ? '🏴󠁧󠁢󠁳󠁣󠁴󠁿' :
               player.nationality === 'S. Korea' ? '🇰🇷' :
               player.nationality === 'Canada' ? '🇨🇦' :
               player.nationality === 'Sweden' ? '🇸🇪' :
               player.nationality === 'Mali' ? '🇲🇱' :
               player.nationality === 'Senegal' ? '🇸🇳' :
               player.nationality === 'Croatia' ? '🇭🇷' :
               player.nationality === 'Slovenia' ? '🇸🇮' :
               player.nationality === 'Montenegro' ? '🇲🇪' :
               player.nationality === 'Ecuador' ? '🇪🇨' :
               player.nationality === 'Ukraine' ? '🇺🇦' :
               player.nationality === 'N. Ireland' ? '🇬🇧' :
               player.nationality === 'Wales' ? '🏴󠁧󠁢󠁷󠁬󠁳󠁿' :
               player.nationality === 'Morocco' ? '🇲🇦' :
               player.nationality === 'Armenia' ? '🇦🇲' :
               player.nationality === 'Austria' ? '🇦🇹' :
               player.nationality === 'Cameroon' ? '🇨🇲' :
               player.nationality === 'Turkey' ? '🇹🇷' :
               player.nationality === 'USA' ? '🇺🇸' :
               player.nationality === 'Serbia' ? '🇷🇸' :
               player.nationality === 'Switzerland' ? '🇨🇭' :
               player.nationality === 'Poland' ? '🇵🇱' :
               player.nationality === 'Denmark' ? '🇩🇰' :
               player.nationality === 'S. Korea' ? '🇰🇷' :
               '⚽'}
            </div>
          </div>
        </div>

        {/* Player face placeholder */}
        <div className="card-face-area">
          <div className="face-placeholder">
            <div className="face-silhouette">⚽</div>
          </div>
        </div>

        {/* Player name */}
        <div className="card-player-name" style={{ color: overallColor }}>
          {player.name.toUpperCase().split(' ').map((part, i) => (
            <span key={i} className="name-part">{part}</span>
          ))}
        </div>

        {/* Stats grid */}
        <div className="card-stats-grid">
          {stats.map((stat, idx) => (
            <div key={stat.label} className={`card-stat ${stat.value >= 90 ? 'elite' : stat.value >= 80 ? 'gold' : stat.value >= 70 ? 'silver' : 'bronze'}`}>
              <span className="card-stat-value">{stat.value}</span>
              <span className="card-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Card bottom decoration */}
        <div className="card-bottom-decoration">
          <div className="card-club-logo">⭐</div>
          <div className="card-card-type">
            {player.overall >= 90 ? 'TOTY' : player.overall >= 85 ? 'TOTS' : player.overall >= 80 ? 'POTM' : 'GOLD'}
          </div>
          <div className="card-weak-foot">
            {'⭐'.repeat(player.weakFoot || 3)}
          </div>
          <div className="card-skill-moves">
            {'🌟'.repeat(player.skillMoves || 3)}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="card-hover-overlay" style={{ opacity: hovered ? 1 : 0 }}>
          <div className="hover-details">
            <p>{player.fullName}</p>
            <p>{player.age} yrs • {player.height}cm</p>
            <p>{player.foot === 'Left' ? '🦶 Left' : '🦶 Right'} Foot</p>
          </div>
        </div>
      </div>

      {/* Price tag */}
      {showActions && (
        <div className="card-price-tag">
          <span className="price-value">€{(player.value / 1000000).toFixed(1)}M</span>
          <button
            className="buy-btn"
            disabled={budget < player.value}
            onClick={() => buyPlayer(player)}
          >
            {budget < player.value ? 'NO FUNDS' : 'SIGN'}
          </button>
        </div>
      )}
    </div>
  );
}

export default PlayerCard;
