'use client'

import { useGameStore } from '@/store/gameStore'
import { useRef, useEffect } from 'react'

export default function PlayerChat() {
  const { chatLog, isGameStarted } = useGameStore()
  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [chatLog])

  if (!isGameStarted) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-t-lg">
        <h3 className="font-semibold flex items-center text-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          Player Chat ({chatLog.length})
        </h3>
        <p className="text-xs text-blue-100 dark:text-blue-200 mt-1">
          Private messages between players
        </p>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatScrollRef}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-3 min-h-0"
      >
        {chatLog.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-sm">No messages yet...</p>
            <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">Use the chat input below to communicate</p>
          </div>
        ) : (
          chatLog.map((message, index) => (
            <div 
              key={index}
              className="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 border-l-4 border-blue-400 dark:border-blue-500"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-blue-700 dark:text-blue-300 text-sm">
                  {message.sender}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {message.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
