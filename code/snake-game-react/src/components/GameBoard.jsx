import './GameBoard.css'

function GameBoard({ snake, food, gridSize, gameStatus, isPaused, onResume }) {
  const renderCell = (x, y) => {
    const snakeSegment = snake.find(segment => segment.x === x && segment.y === y)
    const isFood = food && food.x === x && food.y === y

    let cellClass = 'cell'
    let content = ''

    if (snakeSegment) {
      const isHead = snake[0].x === x && snake[0].y === y
      cellClass += isHead ? ' snake-head' : ' snake-body'
    }

    if (isFood) {
      cellClass += ' food'
      cellClass += ` food-${food.type.shape}`
      cellClass += ` food-${food.type.color.replace('#', '')}`
    }

    return (
      <div key={`${x}-${y}`} className={cellClass}>
        {isFood && renderFoodShape(food.type.shape, food.type.color)}
      </div>
    )
  }

  const renderFoodShape = (shape, color) => {
    switch (shape) {
      case 'circle':
        return <div className="food-shape circle" style={{ color }}></div>
      case 'triangle':
        return <div className="food-shape triangle" style={{ color }}></div>
      case 'square':
        return <div className="food-shape square" style={{ color }}></div>
      case 'star':
        return <div className="food-shape star" style={{ color }}></div>
      case 'diamond':
        return <div className="food-shape diamond" style={{ color }}></div>
      default:
        return null
    }
  }

  return (
    <div className="game-board">
      {gameStatus === 'ready' && (
        <div className="game-overlay">
          <div className="game-title">掌机贪吃蛇</div>
          <div className="instructions">
            按 <span>空格键</span> 或点击 <span>开始</span> 按钮<br/>
            使用 <span>方向键</span> 或 <span>WASD</span> 控制方向
          </div>
        </div>
      )}

      {gameStatus === 'gameover' && (
        <div className="game-overlay">
          <div className="game-over">游戏结束</div>
        </div>
      )}

      {isPaused && (
        <div className="game-overlay pause-overlay" onClick={onResume}>
          <div className="pause-icon">⏸️</div>
          <div className="pause-text">游戏暂停</div>
          <div className="pause-hint">点击屏幕或按 P 键继续</div>
        </div>
      )}

      <div className="grid">
        {Array.from({ length: gridSize }).map((_, y) =>
          Array.from({ length: gridSize }).map((_, x) => renderCell(x, y))
        )}
      </div>
    </div>
  )
}

export default GameBoard
