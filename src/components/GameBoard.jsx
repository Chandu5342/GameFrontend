import React from 'react';

export default function GameBoard({ board = [], onDrop, disabled = false }) {
  const rows = board.length;
  const cols = rows ? board[0].length : 7;

  function handleClickCol(c) {
    if (disabled) return;
    if (onDrop) onDrop(c);
  }

  return (
    <div className="table-responsive">
      <table className="table table-borderless game-board" style={{ width: '420px', tableLayout: 'fixed' }}>
        <tbody>
          {board.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} style={{ padding: '6px' }}>
                  <div className="cell" onClick={() => handleClickCol(c)} style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.8 : 1 }}>
                    <div className={`disc ${cell === 1 ? 'player1' : cell === 2 ? 'player2' : ''}`}></div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
