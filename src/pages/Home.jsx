import { useState } from 'react';
import UsernameEntry from '../components/UsernameEntry.jsx';

export default function Home({ onJoined }) {
  return (
    <div className="container py-4">
      <h3>Connect Four</h3>
      <p className="text-muted">Enter a username to join the matchmaking queue.</p>
      <UsernameEntry onJoined={onJoined} />
    </div>
  );
}
