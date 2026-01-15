import { useState, useEffect, useCallback } from 'react'
import GameBoard from './components/GameBoard'
import ControlPanel from './components/ControlPanel'
import ScorePanel from './components/ScorePanel'
import './App.css'

const GRID_SIZE = 20
const INITIAL_SPEED = 150

const FOOD_TYPES = {
  NORMAL: {
    color: '#00ff00',
    shape: 'circle',
    points: 10,
    speedChange: 0,
    description: '普通食物',
    probability: 0.5
  },
  SPEED_UP: {
    color: '#ff6b6b',
    shape: 'triangle',
    points: 15,
    speedChange: -20,
    description: '加速食物',
    probability: 0.15
  },
  SPEED_DOWN: {
    color: '#4ecdc4',
    shape: 'square',
    points: 5,
    speedChange: 30,
    description: '减速食物',
    probability: 0.15
  },
  DOUBLE_POINTS: {
    color: '#ffd93d',
    shape: 'star',
    points: 20,
    speedChange: 0,
    description: '双倍积分',
    probability: 0.1
  },
  SHRINK: {
    color: '#a855f7',
    shape: 'diamond',
    points: 25,
    speedChange: 0,
    description: '缩短蛇身',
    probability: 0.1
  }
}

function App() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [direction, setDirection] = useState({ x: 1, y: 0 })
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 })
  const [food, setFood] = useState(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameStatus, setGameStatus] = useState('ready')
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [doublePointsActive, setDoublePointsActive] = useState(false)
  const [doublePointsTimer, setDoublePointsTimer] = useState(null)
  const [lastEffect, setLastEffect] = useState(null)
  const [isPaused, setIsPaused] = useState(false)

  const generateFood = useCallback(() => {
    const rand = Math.random()
    let cumulative = 0
    let selectedType = FOOD_TYPES.NORMAL

    for (const [type, config] of Object.entries(FOOD_TYPES)) {
      cumulative += config.probability
      if (rand <= cumulative) {
        selectedType = config
        break
      }
    }

    let newFood
    let attempts = 0
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        type: selectedType
      }
      attempts++
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) && attempts < 100)

    return newFood
  }, [snake])

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }])
    setDirection({ x: 1, y: 0 })
    setNextDirection({ x: 1, y: 0 })
    setScore(0)
    setSpeed(INITIAL_SPEED)
    setDoublePointsActive(false)
    setLastEffect(null)
    setIsPaused(false)
    if (doublePointsTimer) {
      clearTimeout(doublePointsTimer)
      setDoublePointsTimer(null)
    }
    setFood(generateFood())
    setGameStatus('playing')
  }, [generateFood, doublePointsTimer])

  const togglePause = useCallback(() => {
    if (gameStatus === 'playing') {
      setIsPaused(prev => !prev)
    }
  }, [gameStatus])

  const handleDirectionChange = useCallback((newDir) => {
    if (gameStatus !== 'playing') return

    const isOpposite = (newDir.x === -direction.x && newDir.y === 0) ||
                       (newDir.y === -direction.y && newDir.x === 0)

    if (!isOpposite) {
      setNextDirection(newDir)
    }
  }, [direction, gameStatus])

  const moveSnake = useCallback(() => {
    if (gameStatus !== 'playing') return

    setDirection(nextDirection)

    setSnake(prevSnake => {
      const newHead = {
        x: prevSnake[0].x + nextDirection.x,
        y: prevSnake[0].y + nextDirection.y
      }

      if (newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameStatus('gameover')
        if (score > highScore) {
          setHighScore(score)
        }
        return prevSnake
      }

      const newSnake = [newHead, ...prevSnake]

      if (food && newHead.x === food.x && newHead.y === food.y) {
        const points = doublePointsActive ? food.type.points * 2 : food.type.points
        setScore(prev => prev + points)
        setLastEffect(food.type.description)

        if (food.type.speedChange !== 0) {
          setSpeed(prev => Math.max(50, Math.min(300, prev + food.type.speedChange)))
        }

        if (food.type === FOOD_TYPES.SHRINK && newSnake.length > 3) {
          newSnake.splice(newSnake.length - 3, 3)
        }

        if (food.type === FOOD_TYPES.DOUBLE_POINTS) {
          setDoublePointsActive(true)
          if (doublePointsTimer) {
            clearTimeout(doublePointsTimer)
          }
          setDoublePointsTimer(setTimeout(() => {
            setDoublePointsActive(false)
          }, 10000))
        }

        setFood(generateFood())
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [gameStatus, nextDirection, food, score, highScore, doublePointsActive, doublePointsTimer, generateFood])

  useEffect(() => {
    if (gameStatus === 'playing' && !isPaused) {
      const interval = setInterval(moveSnake, speed)
      return () => clearInterval(interval)
    }
  }, [gameStatus, moveSnake, speed, isPaused])

  useEffect(() => {
    if (gameStatus === 'ready') {
      setFood(generateFood())
    }
  }, [gameStatus, generateFood])

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault()
          handleDirectionChange({ x: 0, y: -1 })
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          handleDirectionChange({ x: 0, y: 1 })
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          handleDirectionChange({ x: -1, y: 0 })
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          handleDirectionChange({ x: 1, y: 0 })
          break
        case ' ':
          e.preventDefault()
          if (gameStatus === 'ready' || gameStatus === 'gameover') {
            resetGame()
          }
          break
        case 'p':
        case 'P':
        case 'Escape':
          e.preventDefault()
          togglePause()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleDirectionChange, gameStatus, resetGame])

  return (
    <div className="app">
      <div className="handheld-console">
        <div className="console-screen">
          <div className="screen-border">
            <ScorePanel
              score={score}
              highScore={highScore}
              speed={speed}
              doublePointsActive={doublePointsActive}
              lastEffect={lastEffect}
              isPaused={isPaused}
              onResume={togglePause}
            />
            <GameBoard
              snake={snake}
              food={food}
              gridSize={GRID_SIZE}
              gameStatus={gameStatus}
            />
          </div>
        </div>
        <ControlPanel
          onDirectionChange={handleDirectionChange}
          onStart={resetGame}
          gameStatus={gameStatus}
          isPaused={isPaused}
          onPause={togglePause}
        />
      </div>
    </div>
  )
}

export default App
