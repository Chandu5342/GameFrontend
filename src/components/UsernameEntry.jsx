import { useState } from 'react';
import { createUser } from '../api/apiClient.js';

export default function UsernameEntry({ onJoined }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username) return setError('Please enter a username');
    setError(null);
    setLoading(true);
    try {
      const user = await createUser(username);
      onJoined(user);
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-3">
      <h5>Enter Username</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        </div>
        {error && <div className="text-danger mb-2">{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading}>Join</button>
      </form>
    </div>
  );
}
