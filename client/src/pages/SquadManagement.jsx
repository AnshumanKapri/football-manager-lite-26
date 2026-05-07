import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import Sidebar from '../components/Sidebar';
import PlayerCard from '../components/PlayerCard';

function SquadManagement() {
  const navigate = useNavigate();
  const squad = useGameStore(s => s.squad);
  const startingXI = useGameStore(s => s.startingXI);
  const tactics = useGameStore(s => s.tactics);

  return (
    <div className="squad-page">
      <Sidebar />
      <main className="squad-content">
        <header className="page-header">
          <h1>SQUAD MANAGEMENT</h1>
          <p>Formation: {tactics.formation} | Players: {squad.length}</p>
        </header>

        <div className="squad-view">
          <div className="pitch-container">
            <div className="pitch">
              <div className="pitch-lines">
                <div className="center-circle" />
                <div className="half-line" />
                <div className="penalty-box top" />
                <div className="penalty-box bottom" />
              </div>
              <div className="formation-display">
                {startingXI.map((player, idx) => {
                  const positions = getFormationPositions(tactics.formation);
                  const pos = positions[idx] || { top: '50%', left: '50%' };
                  return (
                    <div key={player.id} className="player-on-pitch" style={{ top: pos.top, left: pos.left }}>
                      <div className="player-dot">
                        <span className="player-number">{idx + 1}</span>
                      </div>
                      <span className="player-label">{player.name}</span>
                      <span className="player-pos">{player.position}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="squad-list">
            <h3>PLAYERS</h3>
            <div className="players-scroll">
              {squad.map(player => (
                <PlayerCard key={player.id} player={player} compact />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function getFormationPositions(formation) {
  const formations = {
    '4-3-3': [
      { top: '90%', left: '50%' }, // GK
      { top: '70%', left: '15%' }, { top: '70%', left: '38%' }, { top: '70%', left: '62%' }, { top: '70%', left: '85%' }, // DEF
      { top: '50%', left: '25%' }, { top: '50%', left: '50%' }, { top: '50%', left: '75%' }, // MID
      { top: '25%', left: '20%' }, { top: '20%', left: '50%' }, { top: '25%', left: '80%' } // FWD
    ],
    '4-4-2': [
      { top: '90%', left: '50%' },
      { top: '72%', left: '15%' }, { top: '72%', left: '38%' }, { top: '72%', left: '62%' }, { top: '72%', left: '85%' },
      { top: '50%', left: '15%' }, { top: '50%', left: '38%' }, { top: '50%', left: '62%' }, { top: '50%', left: '85%' },
      { top: '25%', left: '35%' }, { top: '25%', left: '65%' }
    ],
    '4-2-3-1': [
      { top: '90%', left: '50%' },
      { top: '72%', left: '15%' }, { top: '72%', left: '38%' }, { top: '72%', left: '62%' }, { top: '72%', left: '85%' },
      { top: '55%', left: '35%' }, { top: '55%', left: '65%' },
      { top: '38%', left: '20%' }, { top: '35%', left: '50%' }, { top: '38%', left: '80%' },
      { top: '20%', left: '50%' }
    ],
    '3-5-2': [
      { top: '90%', left: '50%' },
      { top: '72%', left: '25%' }, { top: '72%', left: '50%' }, { top: '72%', left: '75%' },
      { top: '50%', left: '10%' }, { top: '50%', left: '35%' }, { top: '50%', left: '50%' }, { top: '50%', left: '65%' }, { top: '50%', left: '90%' },
      { top: '25%', left: '35%' }, { top: '25%', left: '65%' }
    ]
  };
  return formations[formation] || formations['4-3-3'];
}

export default SquadManagement;
