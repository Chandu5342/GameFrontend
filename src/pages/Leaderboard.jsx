import { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/apiClient.js';

export default function Leaderboard() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getLeaderboard().then(setList).catch(() => setList([]));
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
