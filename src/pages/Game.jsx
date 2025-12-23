import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import GameBoard from '../components/GameBoard.jsx';

export default function Game({ user }) {
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(Array.from({ length: 6 }, () => Array(7).fill(0)));
  const [status, setStatus] = useState('Waiting for match...');
  const [playerNumber, setPlayerNumber] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [error, setError] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_API_WS || 'http://localhost:4000');
    socketRef.current = s;

    s.on('connect', () => console.log('connected', s.id));

    s.emit('join', { username: user.username });

    s.on('queue:joined', (p) => setStatus('Waiting in queue...'));

    s.on('queue:countdown', (p) => {
      setStatus(`Waiting in queue... ${p.remaining}s`);
    });

    s.on('game:start', (payload) => {
      setGameId(payload.gameId);
      setPlayerNumber(payload.playerNumber);
      setBoard(payload.board);
      setCurrentTurn(payload.currentTurn ?? 1);
      setStatus(`Game started vs ${payload.opponent}${payload.bot ? ' (BOT)' : ''}`);
    });

      s.on('game:update', (payload) => {
      // If there is a lastMove, animate highlight then apply board update
      if (payload.lastMove) {
        const flashDuration = payload.bot ? 600 : 300;
        setStatus(payload.bot ? 'Bot is thinking...' : 'Updating...');
        setLastMove(payload.lastMove);
        // wait for a short animation then update board
        setTimeout(() => {
          setBoard(payload.board);
          setCurrentTurn(payload.currentTurn ?? payload.nextTurn ?? currentTurn);
          setLastMove(null);
          if (payload.result && payload.result !== 'ongoing') {
            if (payload.result === 'win') {
              if (payload.winner) {
                const meWon = payload.winner === user.id;
                setStatus(meWon ? 'You won!' : 'You lost');
              } else setStatus('Game over');
            } else setStatus(payload.result);
          } else {
            const isMyTurn = playerNumber === payload.currentTurn;
            setStatus(isMyTurn ? 'Your turn' : `Opponent's turn`);
          }
        }, flashDuration);
      } else {
        setBoard(payload.board);
        setCurrentTurn(payload.currentTurn ?? payload.nextTurn ?? currentTurn);
        if (payload.result && payload.result !== 'ongoing') {
          if (payload.result === 'win') {
            if (payload.winner) {
              const meWon = payload.winner === user.id;
              setStatus(meWon ? 'You won!' : 'You lost');
            } else setStatus('Game over');
          } else setStatus(payload.result);
        } else {
          const isMyTurn = playerNumber === payload.currentTurn;
          setStatus(isMyTurn ? 'Your turn' : `Opponent's turn`);
        }
      }
    });

    s.on('game:ended', (payload) => {
      setStatus('Game ended: ' + payload.result);
    });

    s.on('player:disconnected', (p) => {
      setStatus('Opponent disconnected, waiting...');
    });

    s.on('game:resume', (payload) => {
      setBoard(payload.board);
      setCurrentTurn(payload.currentTurn ?? currentTurn);
      setStatus('Game resumed');
    });

    s.on('move:error', (payload) => {
      setError(payload.error || 'Invalid move');
      setTimeout(() => setError(null), 3000);
    });

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [user]);

  function onDrop(col) {
    if (!socket || !gameId) return;
    const isMyTurn = playerNumber === currentTurn;
    if (!isMyTurn) {
      setError('Not your turn');
      setTimeout(() => setError(null), 2000);
      return;
    }
    socket.emit('move', { gameId, col });
  }

  const isDisabled = playerNumber == null || currentTurn == null || playerNumber !== currentTurn || (status && status.toLowerCase().includes('game over'));

  return (
    <div className="container py-4">
      <h4>Player: {user.username}</h4>
      <div className="mb-2">Status: <strong>{status}</strong></div>
      {error && <div className="alert alert-warning">{error}</div>}
      <div className="mb-2">
        <button className="btn btn-outline-danger me-2" onClick={() => {
          if (window.confirm('Resign and forfeit the game?')) {
            if (socket) socket.emit('resign');
          }
        }} disabled={!gameId}>Resign</button>
      </div>
      <GameBoard board={board} onDrop={onDrop} disabled={isDisabled} lastMove={lastMove} />
    </div>
  );
}
