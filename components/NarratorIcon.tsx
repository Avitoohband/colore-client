'use client'

import { useGameStore } from '@/store/gameStore'

export default function NarratorIcon() {
  const { isSpeaking } = useGameStore()

  if (!isSpeaking) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="bg-purple-600 dark:bg-purple-700 rounded-full p-3 shadow-lg animate-pulse">
        <div className="flex items-center justify-center w-8 h-8">
          {/* Animated speaking icon */}
          <div className="flex space-x-1">
            <div className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-1 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap opacity-90">
        AI Narrator Speaking...
        <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </div>
  )
}

/* Add custom animation classes to your global CSS if not already present */
/*
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
*/
