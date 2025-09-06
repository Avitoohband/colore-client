'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

interface TranslationModalProps {
  isOpen: boolean
  onClose: () => void
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' }
]

// Get last used language from localStorage
const getLastUsedLanguage = (): string => {
  if (typeof window === 'undefined') return 'en'
  try {
    return localStorage.getItem('lastTranslateLanguage') || 'en'
  } catch {
    return 'en'
  }
}

// Save language to localStorage
const saveLastUsedLanguage = (langCode: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('lastTranslateLanguage', langCode)
  } catch {
    // Ignore localStorage errors
  }
}

export default function TranslationModal({ isOpen, onClose }: TranslationModalProps) {
  const { isDarkMode } = useGameStore()
  const [inputText, setInputText] = useState('')
  const [targetLanguage, setTargetLanguage] = useState(getLastUsedLanguage())
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState('')
  const [provider, setProvider] = useState('')

  // Update target language when modal opens
  useEffect(() => {
    if (isOpen) {
      setTargetLanguage(getLastUsedLanguage())
    }
  }, [isOpen])

  // Save language preference when it changes
  useEffect(() => {
    saveLastUsedLanguage(targetLanguage)
  }, [targetLanguage])

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInputText('')
      setTranslatedText('')
      setError('')
      setProvider('')
      setIsTranslating(false)
    }
  }, [isOpen])

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate')
      return
    }

    setIsTranslating(true)
    setError('')
    setTranslatedText('')
    setProvider('')

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText.trim(),
          targetLang: targetLanguage,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `Translation failed: ${response.statusText}`)
      }

      if (data.error) {
        throw new Error(data.error)
      }

      setTranslatedText(data.translatedText || 'Translation unavailable')
      setProvider(data.provider || 'Unknown')
    } catch (err) {
      console.error('Translation error:', err)
      setError(err instanceof Error ? err.message : 'Translation failed. Please try again.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleCopyToClipboard = async () => {
    if (!translatedText) return
    
    try {
      await navigator.clipboard.writeText(translatedText)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  if (!isOpen) return null

  const selectedLanguage = languages.find(lang => lang.code === targetLanguage)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🌐</div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Translator
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Translate text to any language
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              title="Close translator (Esc)"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Text to translate
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              maxLength={5000}
            />
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>{inputText.length}/5000 characters</span>
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Translate to
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Translate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[120px]"
            >
              {isTranslating ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Translating...</span>
                </div>
              ) : (
                'Translate'
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Translation Result */}
          {translatedText && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Translation {selectedLanguage && `(${selectedLanguage.flag} ${selectedLanguage.name})`}
                  </label>
                  {provider && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Powered by {provider}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleCopyToClipboard}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                  title="Copy to clipboard"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{translatedText}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            💡 Tip: Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Ctrl+Alt+T</kbd> to quickly open the translator
          </p>
        </div>
      </div>
    </div>
  )
}
