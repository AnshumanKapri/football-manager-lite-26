import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';
import { TEAMS } from '../data/leagues';
import Sidebar from '../components/Sidebar';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || window.location.origin || 'http://localhost:3001';

function MultiplayerLobby() {
  const navigate = useNavigate();
  const playerName = useGameStore(s => s.playerName);
  const socket = useGameStore(s => s.socket);
  const setSocket = useGameStore(s => s.setSocket);

  const [mode, setMode] = useState('menu'); // menu, rooms, in_room, match
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [matchState, setMatchState] = useState(null);
  const [error, setError] = useState('');

  const handleSocketEvents = useCallback(() => {
    if (!socket) return;

    socket.on('room_list', (roomList) => {
      setRooms(roomList);
    });

    socket.on('room_created', ({ roomId }) => {
      setJoinCode(roomId);
      setMode('in_room');
    });

    socket.on('room_update', (room) => {
      setCurrentRoom(room);
      if (room.status === 'playing') {
        setMode('match');
      }
    });

    socket.on('all_ready', () => {
      setError('All players ready! Host can start the match.');
    });

    socket.on('match_started', (match) => {
      setMatchState(match);
      setMode('match');
    });

    socket.on('match_update', (update) => {
      setMatchState(prev => ({
        ...prev,
        minute: update.minute,
        score: update.score,
        stats: update.stats,
        lastEvent: update.event
      }));
    });

    socket.on('match_finished', (result) => {
      setMatchState(prev => ({
        ...prev,
        fullTime: true,
        finalScore: result.score,
        finalStats: result.stats
      }));
    });

    socket.on('chat_message', (msg) => {
      setChatMessages(prev => [...prev, msg]);
    });

    socket.on('error', ({ message }) => {
      setError(message);
      setTimeout(() => setError(''), 3000);
    });
  }, [socket]);

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      handleSocketEvents();
    }
  }, [socket, handleSocketEvents]);

  const createRoom = () => {
    if (!socket || !playerName) return;
    socket.emit('create_room', {
      hostName: playerName,
      roomName: roomName || `${playerName}'s Room`
    });
  };

  const joinRoom = () => {
    if (!socket || !playerName || !joinCode) return;
    socket.emit('join_room', { roomId: joinCode, playerName });
    setMode('in_room');
  };

  const toggleReady = () => {
    if (socket && currentRoom) {
      socket.emit('toggle_ready', currentRoom.id);
      setIsReady(!isReady);
    }
  };

  const selectTeam = (teamId) => {
    if (socket && currentRoom) {
      const team = TEAMS.find(t => t.id === teamId);
      socket.emit('select_team', { roomId: currentRoom.id, team });
      setSelectedTeam(team);
    }
  };

  const startMatch = () => {
    if (socket && currentRoom) {
      socket.emit('start_match', currentRoom.id);
    }
  };

  const sendChat = () => {
    if (socket && currentRoom && chatMessage.trim() && playerName) {
      socket.emit('chat_message', {
        roomId: currentRoom.id,
        playerName,
        message: chatMessage
      });
      setChatMessage('');
    }
  };

  const leaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit('leave_room', currentRoom.id);
      setCurrentRoom(null);
      setMode('menu');
      setChatMessages([]);
    }
  };

  const getAvailableTeams = () => {
    if (!currentRoom) return TEAMS;
    const takenTeams = [currentRoom.homeTeam?.id, currentRoom.awayTeam?.id];
    return TEAMS.filter(t => !takenTeams.includes(t.id));
  };

  // MENU VIEW
  if (mode === 'menu') {
    return (
      <div className="multiplayer-page">
        <Sidebar />
        <main className="multiplayer-content">
          <header className="page-header">
            <h1>⚡ MULTIPLAYER</h1>
            <p>Challenge friends across networks • {playerName}</p>
          </header>

          <div className="multiplayer-menu">
            <div className="mp-card glass-card">
              <h3>🏠 CREATE ROOM</h3>
              <p>Host a match and invite friends</p>
              <input
                type="text"
                className="neon-input"
                placeholder="Room Name (optional)"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
              />
              <button className="neon-btn" onClick={createRoom}>CREATE ROOM</button>
            </div>

            <div className="mp-card glass-card">
              <h3>🔗 JOIN ROOM</h3>
              <p>Enter a room code to join</p>
              <input
                type="text"
                className="neon-input"
                placeholder="Enter Room Code..."
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
              />
              <button className="neon-btn" onClick={joinRoom} disabled={!joinCode}>JOIN</button>
            </div>

            <div className="mp-card glass-card">
              <h3>🌐 BROWSE ROOMS</h3>
              <p>{rooms.length} rooms available</p>
              <button className="neon-btn neon-btn-outline" onClick={() => setMode('rooms')}>BROWSE</button>
            </div>
          </div>

          {error && <div className="error-toast">{error}</div>}
        </main>
      </div>
    );
  }

  // ROOMS LIST VIEW
  if (mode === 'rooms') {
    return (
      <div className="multiplayer-page">
        <Sidebar />
        <main className="multiplayer-content">
          <header className="page-header">
            <h1>🌐 BROWSE ROOMS</h1>
            <button className="neon-btn neon-btn-outline" onClick={() => setMode('menu')}>← Back</button>
          </header>

          <div className="rooms-list">
            {rooms.length === 0 ? (
              <p className="no-rooms">No rooms available. Create one!</p>
            ) : (
              rooms.map(room => (
                <div key={room.id} className="room-item glass-card">
                  <div className="room-info">
                    <h3>{room.name}</h3>
                    <p>Host: {room.hostName}</p>
                    <span className={`room-status ${room.status}`}>{room.status.toUpperCase()}</span>
                  </div>
                  <div className="room-players">
                    <span>{room.players}/{room.maxPlayers} Players</span>
                  </div>
                  <button
                    className="neon-btn"
                    onClick={() => { setJoinCode(room.id); joinRoom(); }}
                    disabled={room.status !== 'waiting' || room.players >= room.maxPlayers}
                  >
                    JOIN
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  // IN ROOM VIEW
  if (mode === 'in_room' && currentRoom) {
    const availableTeams = getAvailableTeams();
    const host = currentRoom.players.find(p => p.isHost);
    const isHost = currentRoom.hostId === socket?.id;

    return (
      <div className="multiplayer-page">
        <Sidebar />
        <main className="multiplayer-content">
          <header className="page-header">
            <h1>🏠 ROOM: {currentRoom.name}</h1>
            <div className="header-actions">
              <span className="room-code">Code: <span className="neon-text">{currentRoom.id}</span></span>
              <button className="neon-btn neon-btn-outline" onClick={leaveRoom}>LEAVE</button>
            </div>
          </header>

          {error && <div className="error-toast">{error}</div>}

          <div className="lobby-content">
            {/* Players */}
            <div className="players-panel glass-card">
              <h3>👥 PLAYERS ({currentRoom.players.length}/2)</h3>
              {currentRoom.players.map(player => (
                <div key={player.id} className={`lobby-player ${player.ready ? 'ready' : ''}`}>
                  <span className={`player-status ${player.ready ? 'ready' : 'not-ready'}`}>
                    {player.ready ? '✓' : '○'}
                  </span>
                  <span className="player-name">{player.name}</span>
                  {player.isHost && <span className="host-badge">HOST</span>}
                </div>
              ))}
              {currentRoom.players.length < 2 && (
                <div className="waiting-player">
                  <div className="pulse-dot" />
                  Waiting for opponent...
                </div>
              )}
            </div>

            {/* Team Selection */}
            <div className="team-selection-panel glass-card">
              <h3>⚽ SELECT TEAMS</h3>
              
              <div className="team-display">
                <div className="team-slot home">
                  <h4>HOME</h4>
                  {currentRoom.homeTeam ? (
                    <div className="selected-team" style={{ background: `linear-gradient(135deg, ${currentRoom.homeTeam.color}, ${currentRoom.homeTeam.secondaryColor})` }}>
                      {currentRoom.homeTeam.name}
                    </div>
                  ) : (
                    <div className="team-select-dropdown">
                      {isHost && (
                        <select className="neon-input" onChange={e => e.target.value && selectTeam(e.target.value)} value="">
                          <option value="">Select Team</option>
                          {availableTeams.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.rating})</option>
                          ))}
                        </select>
                      )}
                      {!isHost && <span className="waiting-text">Waiting for host...</span>}
                    </div>
                  )}
                </div>

                <div className="vs-badge-large">VS</div>

                <div className="team-slot away">
                  <h4>AWAY</h4>
                  {currentRoom.awayTeam ? (
                    <div className="selected-team" style={{ background: `linear-gradient(135deg, ${currentRoom.awayTeam.color}, ${currentRoom.awayTeam.secondaryColor})` }}>
                      {currentRoom.awayTeam.name}
                    </div>
                  ) : (
                    <div className="team-select-dropdown">
                      {!isHost && (
                        <select className="neon-input" onChange={e => e.target.value && selectTeam(e.target.value)} value="">
                          <option value="">Select Team</option>
                          {availableTeams.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.rating})</option>
                          ))}
                        </select>
                      )}
                      {isHost && <span className="waiting-text">Waiting for guest...</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="lobby-actions">
              <button className={`neon-btn ${isReady ? 'ready-btn' : ''}`} onClick={toggleReady}>
                {isReady ? '✓ READY' : 'NOT READY'}
              </button>
              {isHost && currentRoom.players.every(p => p.ready) && currentRoom.homeTeam && currentRoom.awayTeam && (
                <button className="neon-btn neon-btn-secondary start-match-btn" onClick={startMatch}>
                  🚀 START MATCH
                </button>
              )}
            </div>

            {/* Chat */}
            <div className="chat-panel glass-card">
              <h3>💬 CHAT</h3>
              <div className="chat-messages">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="chat-msg">
                    <span className="chat-author">{msg.playerName}:</span>
                    <span className="chat-text">{msg.message}</span>
                  </div>
                ))}
                {chatMessages.length === 0 && <p className="chat-placeholder">No messages yet</p>}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  className="neon-input"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendChat()}
                />
                <button className="neon-btn" onClick={sendChat}>SEND</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // MATCH VIEW
  if (mode === 'match' && matchState) {
    return (
      <div className="live-match-page">
        <header className="match-header">
          <button className="back-btn" onClick={leaveRoom}>← Leave Room</button>
          <h2>
            <span style={{ color: matchState.homeTeam?.color }}>{matchState.homeTeam?.name}</span>
            {' '}vs{' '}
            <span style={{ color: matchState.awayTeam?.color }}>{matchState.awayTeam?.name}</span>
          </h2>
          <div className="match-timer">
            <span className={`timer ${matchState.status === 'playing' ? 'pulsing' : ''}`}>
              {matchState.minute}'
            </span>
          </div>
        </header>

        <div className="scoreboard">
          <div className="score-team home">
            <span className="team-abbr">{matchState.homeTeam?.shortName}</span>
            <span className="player-name-sm">{matchState.homePlayer}</span>
          </div>
          <div className="score-display">
            <span className="score home-score">{matchState.score?.home || 0}</span>
            <span className="score-divider">-</span>
            <span className="score away-score">{matchState.score?.away || 0}</span>
          </div>
          <div className="score-team away">
            <span className="team-abbr">{matchState.awayTeam?.shortName}</span>
            <span className="player-name-sm">{matchState.awayPlayer}</span>
          </div>
        </div>

        <div className="match-controls">
          {matchState.status === 'playing' && !matchState.fullTime && (
            <button className="neon-btn" onClick={() => socket?.emit('simulate_minute', { matchId: matchState.id })}>
              ▶ SIMULATE NEXT MINUTE
            </button>
          )}
        </div>

        <div className="match-content">
          <div className="commentary-panel glass-card">
            <h3>📢 LIVE COMMENTARY</h3>
            <div className="commentary-feed">
              {matchState.lastEvent && (
                <div className={`commentary-item ${matchState.lastEvent.type === 'goal' ? 'goal-event' : ''}`}>
                  <span className="commentary-time">{matchState.minute}'</span>
                  <span className="commentary-type">
                    {matchState.lastEvent.type === 'goal' ? '⚽' : matchState.lastEvent.type === 'shot' ? '🎯' : '📊'}
                  </span>
                  <span className="commentary-text">{matchState.lastEvent.description}</span>
                </div>
              )}
              <p className="waiting-text">Click "Simulate Next Minute" to advance the match</p>
            </div>
          </div>

          <div className="stats-panel glass-card">
            <h3>📊 MATCH STATS</h3>
            {matchState.stats && (
              <>
                <div className="stat-row">
                  <span>{matchState.stats.home.possession}%</span>
                  <span>Possession</span>
                  <span>{matchState.stats.away.possession}%</span>
                </div>
                <div className="stat-row">
                  <span>{matchState.stats.home.shots}</span>
                  <span>Shots</span>
                  <span>{matchState.stats.away.shots}</span>
                </div>
                <div className="stat-row">
                  <span>{matchState.stats.home.shotsOnTarget}</span>
                  <span>On Target</span>
                  <span>{matchState.stats.away.shotsOnTarget}</span>
                </div>
                <div className="stat-row">
                  <span>{matchState.stats.home.corners}</span>
                  <span>Corners</span>
                  <span>{matchState.stats.away.corners}</span>
                </div>
                <div className="stat-row">
                  <span>{matchState.stats.home.fouls}</span>
                  <span>Fouls</span>
                  <span>{matchState.stats.away.fouls}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {matchState.fullTime && (
          <div className="full-time-overlay">
            <div className="full-time-card glass-card">
              <h2>FULL TIME</h2>
              <div className="final-score">
                <span>{matchState.homeTeam?.shortName}</span>
                <span className="score-final">{matchState.finalScore?.home} - {matchState.finalScore?.away}</span>
                <span>{matchState.awayTeam?.shortName}</span>
              </div>
              <div className="match-result">
                <p>{matchState.homePlayer} vs {matchState.awayPlayer}</p>
              </div>
              <button className="neon-btn" onClick={leaveRoom}>RETURN TO LOBBY</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default MultiplayerLobby;
