'use client'

import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import TurnIndicator from '@/components/TurnIndicator'
import StoryLog from '@/components/StoryLog'
import PlayerInput from '@/components/PlayerInput'
import PlayerChat from '@/components/PlayerChat'
import ChatInput from '@/components/ChatInput'

export default function Home() {
  const { 
    players, 
    isGameStarted, 
    isDarkMode,
    addPlayer, 
    removePlayer, 
    startGame, 
    resetGame,
    toggleDarkMode 
  } = useGameStore()
  const [newPlayerName, setNewPlayerName] = useState('')

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlayerName.trim()) return
    
    addPlayer(newPlayerName.trim())
    setNewPlayerName('')
  }

  const handleStartGame = () => {
    if (players.length >= 2) {
      startGame()
    }
  }

  if (!isGameStarted) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              🎭 CoLore
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Collaborative Storytelling Game
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Create amazing stories together, one turn at a time
            </p>
          </div>

          {/* Setup Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-purple-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Game Setup
            </h2>

            {/* Add Players */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Players (minimum 2)
              </label>
              <form onSubmit={handleAddPlayer} className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Enter player name"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={!newPlayerName.trim()}
                  className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Add
                </button>
              </form>

              {/* Player List */}
              {players.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Players:</h3>
                  {players.map((player, index) => (
                    <div 
                      key={player.id}
                      className="flex items-center justify-between bg-purple-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <span className="flex items-center text-gray-900 dark:text-gray-100">
                        <span className="w-6 h-6 bg-purple-500 dark:bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3">
                          {index + 1}
                        </span>
                        {player.name}
                      </span>
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Start Game Button */}
            <div className="text-center">
              <button
                onClick={handleStartGame}
                disabled={players.length < 2}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-800 dark:hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {players.length < 2 
                  ? `Need ${2 - players.length} more player${2 - players.length > 1 ? 's' : ''}`
                  : 'Start Game'
                }
              </button>
              {players.length >= 2 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Ready to begin your adventure!
                </p>
              )}
            </div>
          </div>

          {/* How to Play */}
          <div className="mt-8 bg-blue-50 dark:bg-gray-700 rounded-xl p-6 border border-blue-100 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
              🎮 How to Play
            </h3>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
              <li className="flex items-start">
                <span className="w-5 h-5 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">1</span>
                Players take turns describing what their character does
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">2</span>
                An AI narrator responds and continues the story
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">3</span>
                Use the private chat to discuss strategy (AI won't see it)
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">4</span>
                Work together to create an amazing collaborative story!
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top: Game Title + Turn Indicator */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                🎭 CoLore
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Collaborative Storytelling in Progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <TurnIndicator />
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button
                onClick={resetGame}
                className="px-3 py-2 text-sm bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Reset Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Story Log + Player Chat */}
      <div className="flex-1 p-4 min-h-0">
        <div className="max-w-6xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Center-Left: Story Log */}
            <div className="flex flex-col min-h-0">
              <StoryLog />
            </div>

            {/* Center-Right: Player Chat */}
            <div className="flex flex-col min-h-0">
              <PlayerChat />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Input Areas */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Story Input (only visible on player's turn) */}
            <div>
              <PlayerInput />
            </div>
            
            {/* Chat Input (always visible) */}
            <div>
              <ChatInput />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
