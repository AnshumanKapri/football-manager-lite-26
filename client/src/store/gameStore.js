import { create } from 'zustand';
import { TEAMS } from '../data/leagues';
import { PLAYERS } from '../data/players';

export const useGameStore = create((set, get) => ({
  // User state
  playerName: '',
  userTeam: null,
  selectedLeague: 'epl',
  currentWeek: 1,
  currentSeason: 1,
  phase: 'menu', // menu, teamSelect, dashboard, match, transfer

  // Multiplayer
  socket: null,
  lobbyId: null,
  lobby: null,
  isHost: false,

  // Finances
  budget: 100000000,
  wageBudget: 80000000,
  totalWages: 0,
  revenue: 0,
  expenses: 0,
  balance: 0,

  // Squad
  squad: [],
  startingXI: [],
  substitutes: [],
  tactics: {
    formation: '4-3-3',
    mentality: 'balanced',
    pressing: 65,
    width: 50,
    depth: 50,
    attackingMentality: 50,
    pressingIntensity: 50
  },

  // League
  leagueTable: [],
  fixtures: [],
  results: [],
  transferList: [],

  // Training
  trainingFocus: 'overall',
  trainingSchedule: [],
  playerMorale: {},

  // Objectives
  objectives: [],
  achievements: [],

  // Actions
  setPlayerName: (name) => set({ playerName: name, phase: 'teamSelect' }),
  
  selectTeam: (teamId) => {
    const team = TEAMS.find(t => t.id === teamId);
    if (team) {
      const squadPlayers = team.players.map(pid => PLAYERS[pid]).filter(Boolean);
      set({
        userTeam: team,
        squad: squadPlayers,
        startingXI: squadPlayers.slice(0, 11),
        substitutes: squadPlayers.slice(11),
        budget: team.budget,
        wageBudget: team.wageBudget,
        totalWages: squadPlayers.reduce((sum, p) => sum + p.wage * 52, 0),
        selectedLeague: team.league,
        phase: 'dashboard'
      });
      get().generateLeagueTable(team.league);
      get().generateFixtures(team.league);
    }
  },

  generateLeagueTable: (leagueId) => {
    const leagueTeams = TEAMS.filter(t => t.league === leagueId);
    const table = leagueTeams.map((team, idx) => ({
      position: idx + 1,
      teamId: team.id,
      teamName: team.name,
      shortName: team.shortName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: []
    }));
    set({ leagueTable: table });
  },

  generateFixtures: (leagueId) => {
    const leagueTeams = TEAMS.filter(t => t.league === leagueId);
    const fixtures = [];
    for (let week = 1; week <= 38; week++) {
      const weekFixtures = [];
      for (let i = 0; i < leagueTeams.length / 2; i++) {
        weekFixtures.push({
          week,
          home: leagueTeams[i],
          away: leagueTeams[leagueTeams.length - 1 - i],
          played: false,
          score: null
        });
      }
      fixtures.push(...weekFixtures);
    }
    set({ fixtures });
  },

  updateTactics: (updates) => set((state) => ({
    tactics: { ...state.tactics, ...updates }
  })),

  setFormation: (formation) => set((state) => ({
    tactics: { ...state.tactics, formation }
  })),

  addToTransferList: (playerId) => set((state) => ({
    transferList: [...state.transferList, playerId]
  })),

  buyPlayer: (player) => set((state) => {
    if (state.budget >= player.value) {
      return {
        squad: [...state.squad, player],
        budget: state.budget - player.value,
        totalWages: state.totalWages + player.wage * 52
      };
    }
    return {};
  }),

  sellPlayer: (playerId) => set((state) => {
    const player = state.squad.find(p => p.id === playerId);
    if (player) {
      return {
        squad: state.squad.filter(p => p.id !== playerId),
        budget: state.budget + Math.floor(player.value * 0.8),
        totalWages: state.totalWages - player.wage * 52
      };
    }
    return {};
  }),

  advanceWeek: () => set((state) => {
    const newWeek = state.currentWeek + 1;
    return {
      currentWeek: newWeek > 38 ? 1 : newWeek,
      currentSeason: newWeek > 38 ? state.currentSeason + 1 : state.currentSeason
    };
  }),

  setSocket: (socket) => set({ socket }),
  setLobbyId: (lobbyId) => set({ lobbyId }),
  setLobby: (lobby) => set({ lobby }),
  setIsHost: (isHost) => set({ isHost }),

  setTrainingFocus: (focus) => set({ trainingFocus: focus }),
  
  updatePlayerMorale: (playerId, morale) => set((state) => ({
    playerMorale: { ...state.playerMorale, [playerId]: morale }
  }))
}));
