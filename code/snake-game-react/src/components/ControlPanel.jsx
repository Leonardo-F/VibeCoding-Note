import './ControlPanel.css'

function ControlPanel({ onDirectionChange, onStart, gameStatus, isPaused, onPause }) {
  const handleDirection = (direction) => {
    onDirectionChange(direction)
  }

  const handleStart = () => {
    onStart()
  }

  const handlePause = () => {
    onPause()
  }

  return (
    <div className="control-panel">
      <div className="d-pad">
        <button
          className="d-pad-button up"
          onClick={() => handleDirection({ x: 0, y: -1 })}
          aria-label="上"
        >
          <span className="button-label">▲</span>
        </button>
        <div className="d-pad-middle">
          <button
            className="d-pad-button left"
            onClick={() => handleDirection({ x: -1, y: 0 })}
            aria-label="左"
          >
            <span className="button-label">◀</span>
          </button>
          <div className="d-pad-center"></div>
          <button
            className="d-pad-button right"
            onClick={() => handleDirection({ x: 1, y: 0 })}
            aria-label="右"
          >
            <span className="button-label">▶</span>
          </button>
        </div>
        <button
          className="d-pad-button down"
          onClick={() => handleDirection({ x: 0, y: 1 })}
          aria-label="下"
        >
          <span className="button-label">▼</span>
        </button>
      </div>

      <div className="action-buttons">
        {gameStatus === 'playing' && (
          <button
            className="action-button pause"
            onClick={handlePause}
          >
            <span className="button-text">{isPaused ? '继续' : '暂停'}</span>
          </button>
        )}
        <button
          className="action-button start"
          onClick={handleStart}
          disabled={gameStatus === 'playing' && !isPaused}
        >
          <span className="button-text">{gameStatus === 'playing' && !isPaused ? '游戏中' : '开始'}</span>
        </button>
      </div>
    </div>
  )
}

export default ControlPanel
