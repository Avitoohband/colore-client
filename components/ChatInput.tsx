'use client'

import React, { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useNarrator } from '@/hooks/useNarrator'

export default function ChatInput() {
  const { players, addChatMessage, isGameStarted } = useGameStore()
  const [chatInput, setChatInput] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const { stop } = useNarrator()
  const [wasTyping, setWasTyping] = useState(false)

  // Set default player when players change
  React.useEffect(() => {
    if (players.length > 0 && !selectedPlayer) {
      setSelectedPlayer(players[0].name)
    }
  }, [players, selectedPlayer])

  if (!isGameStarted || players.length === 0) {
    return null
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || !selectedPlayer) return

    addChatMessage(selectedPlayer, chatInput.trim())
    setChatInput('')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">💬 Player Chat:</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">(Private - not seen by AI)</span>
      </div>
      
      <form onSubmit={handleChatSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-0 sm:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {players.map((player) => (
              <option key={player.id} value={player.name}>
                {player.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => {
              const newValue = e.target.value
              setChatInput(newValue)
              
              // Stop narration when user starts typing (not just focusing)
              if (newValue.length > 0 && !wasTyping) {
                stop()
                setWasTyping(true)
              } else if (newValue.length === 0) {
                setWasTyping(false)
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-0 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm whitespace-nowrap"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
