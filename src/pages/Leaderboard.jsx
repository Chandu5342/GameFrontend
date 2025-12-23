import { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/apiClient.js';
import { io } from 'socket.io-client';

export default function Leaderboard() {
  const [list, setList] = useState([]);

  useEffect(() => {
    let mounted = true;
    getLeaderboard().then((l) => mounted && setList(l)).catch(() => mounted && setList([]));

    // create a temporary socket to listen for leaderboard updates
    const s = io(import.meta.env.VITE_API_WS || 'http://localhost:4000');
    s.on('leaderboard:update', (topList) => {
      setList(topList);
    });

    return () => {
      mounted = false;
      s.disconnect();
    };
  }, []);

  return (
    <div className="container py-4">
      <h5>Leaderboard</h5>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          {list.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
