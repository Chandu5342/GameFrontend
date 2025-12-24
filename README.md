# GameTask — Frontend (Connect Four)

Frontend UI for the Connect Four game. Built with React (Vite) and Bootstrap. Connects to the backend for matchmaking, games, and leaderboard.

---

## Features ✨
- Enter username and join matchmaking
- Play vs Player and Play vs BOT
- Reconnect to ongoing games
- Forfeit (Resign) button with confirmation
- Rematch / New Game flow with 20s queue and BOT fallback
- Recent games list and Leaderboard (live updates via socket)
- Animated move and bot thinking UX hints

---

## Tech stack 🔧
- React (Vite)
- Socket.IO client
- Axios
- Bootstrap 5

---

## Pages & Components 📄
- `Home` — username entry
- `Game` — game board, status, resign, rematch controls
- `Leaderboard` — shows top players (live updates)
- `RecentGames` — list of recent finished games
- `components/GameBoard.jsx` — board UI and animations

---

## Setup & Run ▶️
1. Copy `.env.example` to `.env` and set API URL if required:

```
VITE_API_URL=http://localhost:4000
VITE_API_WS=http://localhost:4000
```

2. Install and run:

```bash
cd GameFrontend
npm install
npm run dev
# build for production
npm run build
```

Default dev port: `5173` (Vite). The frontend expects the backend to be running and accessible at `VITE_API_URL`/`VITE_API_WS`.

---

## WebSocket events (client usage) 🔁
Client emits:
- `join` { username }
- `move` { gameId, col }
- `resign` / `leave` — immediate forfeit
- `leaveQueue` — cancel queue
- `rematch` { mode }
- `rematch:accept`, `rematch:decline`

Client listens for:
- `queue:joined`, `queue:countdown`, `queue:left`
- `game:start`, `game:update` (includes `lastMove`), `game:ended`
- `game:bot:thinking`
- `rematch:*` events
- `leaderboard:update`

---

## UI Behavior Notes 💡
- When a game ends a colored popup is shown (green for win, red for loss) with `New Game` and `Cancel` options.
- `New Game` uses matchmaking: 20s wait, cancelable; falls back to BOT if no match found.
- Bot moves are delayed slightly with a `game:bot:thinking` event to enable animated UX.

---

## Testing & Development 🧪
- Run dev backend and frontend concurrently for full experience.
- Use multiple browser tabs or different browsers to simulate two players.

---

## Contributing
- Add features or UI polish with tests where applicable; open a PR with screenshots and notes.

License: MIT
