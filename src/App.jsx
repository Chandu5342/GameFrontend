import { useState } from 'react'
import Home from './pages/Home.jsx'
import Game from './pages/Game.jsx'
import Leaderboard from './pages/Leaderboard.jsx'

import './App.css'

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Home onJoined={(u) => setUser(u)} />;

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container">
          <span className="navbar-brand">Connect Four</span>
          <div>
            <span className="me-3">{user.username}</span>
          </div>
        </div>
      </nav>
      <Game user={user} />
      <hr />
      <Leaderboard />
    </div>
  );
}
