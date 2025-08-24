'use client'

import { useGameStore } from '@/store/gameStore'

export default function TurnIndicator() {
  const { players, currentTurn, isGameStarted } = useGameStore()
  
  if (!isGameStarted || players.length === 0) {
    return null
  }

  const currentPlayer = players[currentTurn]

  return (
    <div className="bg-purple-50 dark:bg-gray-700 rounded-lg px-4 py-2 border border-purple-200 dark:border-gray-600">
      <div className="text-center">
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">
          Current Turn
        </div>
        <div className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-1">
          {currentPlayer?.name}
        </div>
        <div className="flex justify-center items-center space-x-1">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTurn 
                  ? 'bg-purple-500 dark:bg-purple-400 scale-125' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {currentTurn + 1} of {players.length}
        </div>
      </div>
    </div>
  )
}
