import './ScorePanel.css'

function ScorePanel({ score, highScore, speed, baseSpeed, doublePointsActive, lastEffect }) {
  const speedPercentage = Math.round((300 - speed) / 250 * 100)
  const isSpeedUp = speed < baseSpeed
  const isSpeedDown = speed > baseSpeed

  return (
    <div className="score-panel">
      <div className="score-row">
        <div className="score-item">
          <span className="score-label">分数</span>
          <span className="score-value">{score}</span>
        </div>
        <div className="score-item">
          <span className="score-label">最高分</span>
          <span className="score-value">{highScore}</span>
        </div>
      </div>

      <div className="score-row">
        <div className="score-item">
          <span className="score-label">速度</span>
          <div className="speed-bar">
            <div
              className={`speed-fill ${isSpeedUp ? 'speed-up' : ''} ${isSpeedDown ? 'speed-down' : ''}`}
              style={{ width: `${speedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {isSpeedUp && (
        <div className="effect-badge speed-up">
          加速中 (5秒)
        </div>
      )}

      {isSpeedDown && (
        <div className="effect-badge speed-down">
          减速中 (5秒)
        </div>
      )}

      {doublePointsActive && (
        <div className="effect-badge double-points">
          双倍积分生效中!
        </div>
      )}

      {lastEffect && (
        <div className="effect-message">
          {lastEffect}
        </div>
      )}
    </div>
  )
}

export default ScorePanel
