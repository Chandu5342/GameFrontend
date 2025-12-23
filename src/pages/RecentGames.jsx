import { useEffect, useState } from 'react';
import { getGames } from '../api/apiClient.js';

export default function RecentGames() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getGames().then(setList).catch(() => setList([]));
  }, []);

  return (
    <div className="container py-4">
      <h5>Recent Games</h5>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Started</th>
            <th>Players</th>
            <th>Result</th>
            <th>Winner</th>
            <th>Duration (s)</th>
          </tr>
        </thead>
        <tbody>
          {list.map((g) => (
            <tr key={g.id}>
              <td>{new Date(g.startedAt).toLocaleString()}</td>
              <td>{g.players.map((p) => p.username).join(' vs ')}</td>
              <td>{g.result}</td>
              <td>{g.winnerId ? (g.players.find(p => p.id === g.winnerId)?.username || g.winnerId) : '—'}</td>
              <td>{g.durationSeconds ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}