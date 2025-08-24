'use client'

import { useGameStore } from '@/store/gameStore'
import { useState } from 'react'

export default function PlayerInput() {
  const { players, currentTurn, isGameStarted, addStoryMessage, nextTurn } = useGameStore()
  const [input, setInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isGameStarted || players.length === 0) {
    return null
  }

  const currentPlayer = players[currentTurn]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    // Add player's action to story
    addStoryMessage(currentPlayer.name, input.trim())
    
    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiResponses = [
        "The mysterious door creaks open, revealing a swirling vortex of colors beyond...",
        "Suddenly, a wise old owl perches nearby and speaks: 'That was quite clever!'",
        "The ground trembles slightly as your action sets something ancient into motion...",
        "A gentle breeze carries the scent of adventure and distant lands...",
        "The shadows dance as if responding to your bold move...",
        "In the distance, you hear the faint sound of laughter - or is it music?",
        "The very air seems to shimmer with possibility after what you've done...",
        "A small, glowing creature emerges from hiding, clearly intrigued by your actions...",
      ]
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      addStoryMessage('AI Narrator', randomResponse)
      
      setIsSubmitting(false)
    }, 1500)

    setInput('')
    nextTurn()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">🎭 Story Action:</span>
        <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">{currentPlayer.name}'s Turn</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I decide to..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            rows={2}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {input.length}/500 characters
          </span>
          <button
            type="submit"
            disabled={!input.trim() || isSubmitting}
            className="w-full sm:w-auto px-6 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI is thinking...
              </span>
            ) : (
              'Submit Action'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
