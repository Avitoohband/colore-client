'use client'

import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'

interface GameSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onStartStory: (mode: 'genre' | 'custom', value: string, title?: string) => void
}

const genres = [
  { id: 'fantasy', name: 'Fantasy', emoji: '🧙‍♂️', description: 'Magic, mythical creatures, and epic quests' },
  { id: 'sci-fi', name: 'Sci-Fi', emoji: '🚀', description: 'Space exploration, advanced technology, and futuristic worlds' },
  { id: 'mystery', name: 'Mystery', emoji: '🕵️‍♀️', description: 'Puzzles, secrets, and detective work' },
  { id: 'slice-of-life', name: 'Slice of Life', emoji: '☕', description: 'Everyday moments and realistic situations' },
  { id: 'crime', name: 'Crime', emoji: '🚔', description: 'Heists, investigations, and criminal underworld' },
  { id: 'thriller', name: 'Thriller', emoji: '😱', description: 'Suspense, danger, and edge-of-your-seat action' },
  { id: 'romance', name: 'Romance', emoji: '💕', description: 'Love stories and emotional connections' },
  { id: 'historical', name: 'Historical', emoji: '🏛️', description: 'Past eras, historical events, and period settings' },
  { id: 'post-apocalyptic', name: 'Post-Apocalyptic', emoji: '🏚️', description: 'Survival in a world after catastrophe' },
  { id: 'surreal', name: 'Surreal', emoji: '🎭', description: 'Dream-like, bizarre, and unconventional narratives' }
]

export default function GameSetupModal({ isOpen, onClose, onStartStory }: GameSetupModalProps) {
  const [setupMode, setSetupMode] = useState<'choose' | 'genre' | 'custom'>('choose')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [customBackstory, setCustomBackstory] = useState('')
  const [customTitle, setCustomTitle] = useState('')
  const { isDarkMode } = useGameStore()

  if (!isOpen) return null

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId)
  }

  const handleStartWithGenre = () => {
    if (selectedGenre) {
      const genre = genres.find(g => g.id === selectedGenre)
      onStartStory('genre', genre?.name || selectedGenre)
      onClose()
    }
  }

  const handleStartWithCustom = () => {
    if (customBackstory.trim()) {
      onStartStory('custom', customBackstory.trim(), customTitle.trim() || undefined)
      onClose()
    }
  }

  const handleBack = () => {
    if (setupMode === 'genre' || setupMode === 'custom') {
      setSetupMode('choose')
      setSelectedGenre('')
      setCustomBackstory('')
      setCustomTitle('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                🎭 Story Setup
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Choose how to begin your adventure
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {setupMode === 'choose' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  How would you like to start your story?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose a genre for a quick start, or write your own custom backstory
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Genre Option */}
                <button
                  onClick={() => setSetupMode('genre')}
                  className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all duration-200 text-left group"
                >
                  <div className="text-4xl mb-3">🎲</div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    Pick a Genre
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Choose from popular story genres like Fantasy, Sci-Fi, Mystery, and more. 
                    Perfect for jumping right into the action!
                  </p>
                </button>

                {/* Custom Option */}
                <button
                  onClick={() => setSetupMode('custom')}
                  className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all duration-200 text-left group"
                >
                  <div className="text-4xl mb-3">✍️</div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    Custom Backstory
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Write your own setting, characters, and situation. 
                    Create exactly the world you want to explore!
                  </p>
                </button>
              </div>
            </div>
          )}

          {setupMode === 'genre' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Choose Your Genre
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Select the type of story you'd like to experience
                  </p>
                </div>
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  ← Back
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreSelect(genre.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedGenre === genre.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-2">{genre.emoji}</div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      {genre.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {genre.description}
                    </p>
                  </button>
                ))}
              </div>

              {selectedGenre && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleStartWithGenre}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-800 dark:hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                  >
                    Start {genres.find(g => g.id === selectedGenre)?.name} Adventure
                  </button>
                </div>
              )}
            </div>
          )}

          {setupMode === 'custom' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Write Your Custom Backstory
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Describe the world, characters, or situation you'd like to explore
                  </p>
                </div>
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  ← Back
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adventure Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g., The Heist of Nebula's Edge, The Lost Kingdom, Mystery at Midnight Manor..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    maxLength={100}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {customTitle.length}/100 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Backstory
                  </label>
                  <textarea
                    value={customBackstory}
                    onChange={(e) => setCustomBackstory(e.target.value)}
                    placeholder="Example: You are a group of space pirates aboard the starship 'Nebula's Edge', hiding in an asteroid field after stealing a mysterious artifact from the Galactic Empire. Suddenly, your ship's sensors detect an approaching Imperial fleet..."
                    className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    maxLength={1000}
                  />
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {customBackstory.length}/1000 characters
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      💡 Tip: Include setting, characters, and current situation for best results
                    </div>
                  </div>
                </div>
              </div>

              {customBackstory.trim() && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleStartWithCustom}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-800 dark:hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                  >
                    Start Custom Adventure
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
