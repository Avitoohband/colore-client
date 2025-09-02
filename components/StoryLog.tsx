'use client'

import { useGameStore } from '@/store/gameStore'
import { useEffect, useRef } from 'react'
import { useNarrator } from '@/hooks/useNarrator'

export default function StoryLog() {
  const { storyLog } = useGameStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { speak } = useNarrator()
  const lastMessageRef = useRef<number>(0)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [storyLog])

  // Narrate new AI messages
  useEffect(() => {
    if (storyLog.length > lastMessageRef.current) {
      const newMessages = storyLog.slice(lastMessageRef.current)
      const latestAIMessage = newMessages.find(message => message.sender === 'AI Narrator')
      
      if (latestAIMessage) {
        // Small delay to ensure the message is displayed first
        setTimeout(() => {
          speak(latestAIMessage.content)
        }, 100)
      }
      
      lastMessageRef.current = storyLog.length
    }
  }, [storyLog, speak])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 text-white rounded-t-lg">
        <h2 className="text-lg font-semibold flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          Story Log
        </h2>
        <p className="text-xs text-purple-100 dark:text-purple-200 mt-1">
          The collaborative adventure unfolds...
        </p>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-4 min-h-0"
      >
        {storyLog.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <div className="text-4xl mb-2">📖</div>
            <p>Your story will appear here...</p>
            <p className="text-sm mt-1">Start by adding players and let the adventure begin!</p>
          </div>
        ) : (
          storyLog.map((message, index) => (
            <div 
              key={index}
              className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-3 border-l-4 border-purple-400 dark:border-purple-500"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-purple-700 dark:text-purple-300 text-sm">
                  {message.sender}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {message.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
