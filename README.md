# ⚽ FM Lite 26 - Ultimate Football Manager Experience

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-00f0ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?style=for-the-badge&logo=socket.io)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)

**A lite version of Football Manager 26 + FIFA 26 Career Mode with multiplayer support**

[Features](#-features) • [Screenshots](#-screenshots) • [Installation](#-installation) • [Deployment](#-deployment) • [Multiplayer](#-multiplayer-guide)

</div>

---

## ✨ Features

### 🎮 Career Mode
- **15 Top European Clubs** - Arsenal, Man City, Liverpool, Real Madrid, Barcelona, Bayern Munich, PSG, Inter, and more
- **100+ Realistic Players** - Detailed attributes, values, potentials
- **Full Season Management** - 38-week season with fixtures
- **Transfer Market** - Buy/sell players with budget tracking

### 🏆 Management Tools
- **Squad Management** - Interactive pitch view with formation display
- **Tactics Board** - 7 formations, mentality settings, tactical sliders, player instructions
- **Training Center** - Development drills, intensity controls, player growth tracking
- **Finances Portal** - Revenue/expense breakdown, wage structure, budget management

### 🌐 Multiplayer
- **Real-time Matches** - Play against friends across networks via Socket.io
- **Room System** - Create/join rooms with codes
- **Live Match Simulation** - Minute-by-minute commentary
- **In-game Chat** - Communicate with opponents
- **Team Selection** - Pick your clubs before kickoff

### 🎨 FIFA 26 Style UI
- **Ultimate Team Cards** - Authentic FIFA-style player cards with ratings, stats, chemistry
- **Neon Theme** - Cyberpunk-inspired glassmorphism design
- **Animated Elements** - Glowing effects, shimmer animations, goal flashes
- **Responsive Design** - Works on desktop and mobile

---

## 📸 Screenshots

### Landing Page
Stunning neon-themed landing with animated particles and feature showcase

### FIFA-Style Player Cards
```
┌─────────────────────────┐
│  91    ST               │
│        🇳🇴              │
│      [Face Area]        │
│    E. HAALAND           │
│                         │
│  89 PAC  80 DRI  93 SHO │
│  45 DEF  65 PAS  88 PHY │
│                         │
│  ⭐ TOTY  ⭐⭐⭐⭐  🌟🌟🌟   │
└─────────────────────────┘
```

### Dashboard
Quick stats, next match preview, league table, news feed, top scorers, quick actions

---

## 🚀 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/football-manager-lite-26.git
cd football-manager-lite-26

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

This will start:
- **Client**: http://localhost:3000
- **Server**: http://localhost:3001

### Production Build

```bash
# Build client
cd client && npm run build

# Start production server
cd ../server && NODE_ENV=production node index.js
```

---

## 🌍 Deployment

### Deploy to Render

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Create a new **Web Service**
4. Connect your repository
5. Configure:
   - **Build Command**: `npm run install:all && cd client && npm run build`
   - **Start Command**: `cd server && NODE_ENV=production node index.js`
   - **Environment Variables**: `NODE_ENV=production`
6. Deploy!

### Deploy to Railway

1. Push to GitHub
2. Go to [Railway](https://railway.app)
3. Deploy from GitHub repo
4. Set environment variables:
   - `NODE_ENV=production`
5. Railway auto-detects Node.js and deploys

### Deploy to Vercel + Separate Backend

**Frontend (Vercel)**:
1. Push `client/` folder to separate repo
2. Connect to Vercel
3. Set `VITE_SERVER_URL` to your backend URL

**Backend (Render/Railway)**:
1. Deploy `server/` folder
2. Configure CORS to allow your Vercel URL

---

## 🎮 Multiplayer Guide

### How to Play

1. **Start the server** (must be accessible to all players)
2. Both players navigate to **Multiplayer** section
3. Player 1 clicks **Create Room**
4. Player 2 enters the **Room Code** and joins
5. Both players select their teams
6. Both click **Ready**
7. Host clicks **Start Match**
8. Play turn-based match simulation

### Network Configuration

For players on different networks:
- Server must be deployed to a public URL (Render, Railway, etc.)
- Update `VITE_SERVER_URL` in `.env.production` to your server URL
- Share the server URL with all players

### Room Codes

Room codes are 8-character strings (e.g., `a1b2c3d4`). Share this code with your opponent to let them join your room.

---

## 🏗️ Project Structure

```
football-manager-lite-26/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── PlayerCard.jsx    # FIFA-style cards
│   │   │   └── Sidebar.jsx       # Navigation sidebar
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MultiplayerLobby.jsx
│   │   │   ├── LiveMatch.jsx
│   │   │   └── ...
│   │   ├── data/          # Game data
│   │   │   ├── leagues.js # Teams & leagues
│   │   │   └── players.js # Player database
│   │   ├── store/         # Zustand state
│   │   │   └── gameStore.js
│   │   └── styles/        # CSS styles
│   │       ├── global.css
│   │       └── pages.css
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js           # Express + Socket.io server
│   └── package.json
├── package.json           # Root package
├── Procfile              # Render deployment
└── README.md
```

---

## 🎯 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| State | Zustand |
| Styling | Custom CSS, Glassmorphism |
| Backend | Node.js, Express |
| Real-time | Socket.io |
| Deployment | Render, Railway, Vercel |

---

## 🎨 FIFA Card Tiers

| Rating | Tier | Color |
|--------|------|-------|
| 90+ | TOTY | 🟢 Neon Green |
| 85-89 | TOTS | 🔵 Neon Blue |
| 80-84 | POTM | 🟣 Purple |
| 75-79 | GOLD | 🟡 Gold |
| <75 | SILVER | ⚪ Silver |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is for educational purposes. All club names, player names, and logos are properties of their respective owners.

---

## 🙏 Acknowledgments

- Inspired by **Football Manager 26**, **EA Sports FC 26**, and **FC Mobile**
- FIFA Ultimate Team card design inspiration
- Neon/cyberpunk UI trends

---

<div align="center">

**Built with ❤️ for football fans everywhere**

[Report Bug](https://github.com/yourusername/football-manager-lite-26/issues) • [Request Feature](https://github.com/yourusername/football-manager-lite-26/issues)

</div>
