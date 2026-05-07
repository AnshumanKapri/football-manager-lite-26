import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // In production, server runs from project root
  const possiblePaths = [
    path.join(__dirname, '../client/dist'),
    path.join(__dirname, 'client/dist'),
    path.join(process.cwd(), 'client/dist'),
    path.join(__dirname, '../../client/dist')
  ];
  
  let clientDistPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      clientDistPath = p;
      break;
    }
  }
  
  if (clientDistPath) {
    console.log('✅ Serving client from:', clientDistPath);
    app.use(express.static(clientDistPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  } else {
    console.warn('⚠️ Client dist not found. Serving API only.');
  }
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Game state storage
const rooms = new Map();
const activeMatches = new Map();
const players = new Map();

// Player online tracking
io.on('connection', (socket) => {
  console.log(`⚡ Player connected: ${socket.id}`);
  
  players.set(socket.id, { id: socket.id, name: 'Guest', status: 'online', lastSeen: Date.now() });

  // Send current room list
  socket.emit('room_list', Array.from(rooms.values()).map(r => ({
    id: r.id,
    name: r.name,
    hostName: r.hostName,
    players: r.players.length,
    maxPlayers: r.maxPlayers,
    status: r.status
  })));

  // Create room
  socket.on('create_room', (data) => {
    const roomId = uuidv4().slice(0, 8);
    const room = {
      id: roomId,
      name: data.roomName || `${data.hostName}'s Room`,
      hostId: socket.id,
      hostName: data.hostName,
      players: [{ id: socket.id, name: data.hostName, ready: false, isHost: true }],
      maxPlayers: 2,
      status: 'waiting',
      createdAt: Date.now(),
      homeTeam: null,
      awayTeam: null
    };
    
    rooms.set(roomId, room);
    socket.join(roomId);
    
    // Update player info
    const player = players.get(socket.id);
    if (player) player.name = data.hostName;
    
    socket.emit('room_created', { roomId });
    io.emit('room_list', Array.from(rooms.values()).map(r => ({
      id: r.id, name: r.name, hostName: r.hostName, players: r.players.length, maxPlayers: r.maxPlayers, status: r.status
    })));
    console.log(`🏠 Room created: ${roomId} by ${data.hostName}`);
  });

  // Join room
  socket.on('join_room', (data) => {
    const room = rooms.get(data.roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    if (room.players.length >= room.maxPlayers) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }
    if (room.status !== 'waiting') {
      socket.emit('error', { message: 'Match already in progress' });
      return;
    }

    room.players.push({ id: socket.id, name: data.playerName, ready: false, isHost: false });
    socket.join(data.roomId);
    
    const player = players.get(socket.id);
    if (player) player.name = data.playerName;
    
    io.to(data.roomId).emit('room_update', room);
    io.emit('room_list', Array.from(rooms.values()).map(r => ({
      id: r.id, name: r.name, hostName: r.hostName, players: r.players.length, maxPlayers: r.maxPlayers, status: r.status
    })));
    console.log(`👤 ${data.playerName} joined room ${data.roomId}`);
  });

  // Toggle ready
  socket.on('toggle_ready', (roomId) => {
    const room = rooms.get(roomId);
    if (!room) return;
    
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.ready = !player.ready;
      io.to(roomId).emit('room_update', room);
      
      // Check if all players ready
      if (room.players.every(p => p.ready) && room.homeTeam && room.awayTeam) {
        io.to(roomId).emit('all_ready', { canStart: true });
      }
    }
  });

  // Select teams
  socket.on('select_team', (data) => {
    const room = rooms.get(data.roomId);
    if (!room) return;
    
    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;
    
    if (player.isHost) {
      room.homeTeam = data.team;
    } else {
      room.awayTeam = data.team;
    }
    
    io.to(data.roomId).emit('room_update', room);
  });

  // Start match
  socket.on('start_match', (roomId) => {
    const room = rooms.get(roomId);
    if (!room || !room.homeTeam || !room.awayTeam) return;
    if (!room.players.every(p => p.ready)) return;
    
    room.status = 'playing';
    const matchId = uuidv4();
    
    const matchState = {
      id: matchId,
      roomId,
      homeTeam: room.homeTeam,
      awayTeam: room.awayTeam,
      homePlayer: room.players.find(p => p.isHost)?.name || 'Host',
      awayPlayer: room.players.find(p => !p.isHost)?.name || 'Guest',
      minute: 0,
      score: { home: 0, away: 0 },
      events: [],
      stats: {
        home: { possession: 50, shots: 0, shotsOnTarget: 0, corners: 0, fouls: 0, passes: 0, passAccuracy: 80 },
        away: { possession: 50, shots: 0, shotsOnTarget: 0, corners: 0, fouls: 0, passes: 0, passAccuracy: 80 }
      },
      status: 'playing',
      createdAt: Date.now()
    };
    
    activeMatches.set(matchId, matchState);
    io.to(roomId).emit('match_started', matchState);
    console.log(`⚽ Match started: ${room.homeTeam.name} vs ${room.awayTeam.name}`);
  });

  // Simulate match minute
  socket.on('simulate_minute', (data) => {
    const match = activeMatches.get(data.matchId);
    if (!match || match.status !== 'playing') return;
    
    const minute = match.minute + 1;
    match.minute = minute;
    
    // Generate event
    const homeStrength = match.homeTeam?.rating || 80;
    const awayStrength = match.awayTeam?.rating || 80;
    const rand = Math.random();
    
    // Update stats
    match.stats.home.possession = Math.round((homeStrength / (homeStrength + awayStrength)) * 100 + (Math.random() * 6 - 3));
    match.stats.away.possession = 100 - match.stats.home.possession;
    match.stats.home.passes += Math.floor(Math.random() * 12 + 4);
    match.stats.away.passes += Math.floor(Math.random() * 12 + 4);
    
    let event = null;
    
    // Goal chance (3-8%)
    if (rand < 0.04 + (homeStrength - awayStrength) * 0.001) {
      const isHome = Math.random() > 0.5;
      match.score[isHome ? 'home' : 'away']++;
      event = {
        type: 'goal',
        minute,
        team: isHome ? 'home' : 'away',
        description: `⚽ GOAL! ${isHome ? match.homePlayer : match.awayPlayer}'s ${isHome ? match.homeTeam.name : match.awayTeam.name} scores!`,
        timestamp: Date.now()
      };
    } else if (rand < 0.18) {
      // Shot
      const isHome = Math.random() > 0.45;
      match.stats[isHome ? 'home' : 'away'].shots++;
      if (Math.random() > 0.5) match.stats[isHome ? 'home' : 'away'].shotsOnTarget++;
      event = {
        type: 'shot',
        minute,
        team: isHome ? 'home' : 'away',
        description: `${isHome ? match.homeTeam.name : match.awayTeam.name} takes a shot!`,
        timestamp: Date.now()
      };
    } else if (rand < 0.25) {
      const isHome = Math.random() > 0.5;
      match.stats[isHome ? 'home' : 'away'].corners++;
      event = { type: 'corner', minute, team: isHome ? 'home' : 'away', description: `Corner for ${isHome ? match.homeTeam.name : match.awayTeam.name}`, timestamp: Date.now() };
    } else if (rand < 0.32) {
      const isHome = Math.random() > 0.5;
      match.stats[isHome ? 'home' : 'away'].fouls++;
      event = { type: 'foul', minute, team: isHome ? 'home' : 'away', description: `Foul committed by ${isHome ? match.homeTeam.name : match.awayTeam.name}`, timestamp: Date.now() };
    }
    
    if (event) {
      match.events.push(event);
    }
    
    io.to(match.roomId).emit('match_update', {
      minute: match.minute,
      score: match.score,
      event,
      stats: match.stats
    });
    
    // Match finished
    if (minute >= 90) {
      match.status = 'finished';
      match.fullTime = true;
      
      io.to(match.roomId).emit('match_finished', {
        score: match.score,
        events: match.events,
        stats: match.stats,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        homePlayer: match.homePlayer,
        awayPlayer: match.awayPlayer
      });
      
      // Clean up room
      setTimeout(() => {
        rooms.delete(match.roomId);
        activeMatches.delete(match.id);
        io.emit('room_list', Array.from(rooms.values()).map(r => ({
          id: r.id, name: r.name, hostName: r.hostName, players: r.players.length, maxPlayers: r.maxPlayers, status: r.status
        })));
      }, 10000);
    }
  });

  // Chat message
  socket.on('chat_message', (data) => {
    io.to(data.roomId).emit('chat_message', {
      playerId: socket.id,
      playerName: data.playerName,
      message: data.message,
      timestamp: Date.now()
    });
  });

  // Leave room
  socket.on('leave_room', (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      room.players = room.players.filter(p => p.id !== socket.id);
      socket.leave(roomId);
      
      if (room.players.length === 0) {
        rooms.delete(roomId);
      } else {
        // Transfer host if needed
        if (room.hostId === socket.id && room.players.length > 0) {
          room.hostId = room.players[0].id;
          room.hostName = room.players[0].name;
          room.players[0].isHost = true;
        }
        io.to(roomId).emit('room_update', room);
      }
      
      io.emit('room_list', Array.from(rooms.values()).map(r => ({
        id: r.id, name: r.name, hostName: r.hostName, players: r.players.length, maxPlayers: r.maxPlayers, status: r.status
      })));
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Player disconnected: ${socket.id}`);
    players.delete(socket.id);
    
    // Clean up rooms
    for (const [roomId, room] of rooms) {
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) {
        rooms.delete(roomId);
      } else {
        if (room.hostId === socket.id && room.players.length > 0) {
          room.hostId = room.players[0].id;
          room.hostName = room.players[0].name;
          room.players[0].isHost = true;
        }
        io.to(roomId).emit('room_update', room);
      }
    }
    
    io.emit('room_list', Array.from(rooms.values()).map(r => ({
      id: r.id, name: r.name, hostName: r.hostName, players: r.players.length, maxPlayers: r.maxPlayers, status: r.status
    })));
  });
});

// REST API
app.get('/api/rooms', (req, res) => {
  res.json(Array.from(rooms.values()).map(r => ({
    id: r.id, name: r.name, hostName: r.hostName, players: r.players.length, maxPlayers: r.maxPlayers, status: r.status
  })));
});

app.get('/api/players', (req, res) => {
  res.json(Array.from(players.values()));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 FM Lite 26 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
