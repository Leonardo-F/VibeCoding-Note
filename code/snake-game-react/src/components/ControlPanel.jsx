import './ControlPanel.css'

function ControlPanel({ onDirectionChange, onStart, gameStatus }) {
  const handleDirection = (direction) => {
    onDirectionChange(direction)
  }

  const handleStart = () => {
    onStart()
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
        <button
          className="action-button start"
          onClick={handleStart}
          disabled={gameStatus === 'playing'}
        >
          <span className="button-text">{gameStatus === 'playing' ? '游戏中' : '开始'}</span>
        </button>
      </div>
    </div>
  )
}

export default ControlPanel
