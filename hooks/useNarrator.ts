import { useCallback, useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'

export interface NarratorOptions {
  voice?: SpeechSynthesisVoice | null
  rate?: number
  pitch?: number
  volume?: number
}

export function useNarrator() {
  const { narrateEnabled, isSpeaking, setIsSpeaking } = useGameStore()
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Check if speech synthesis is supported
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const speak = useCallback((text: string, options: NarratorOptions = {}) => {
    if (!isSupported || !narrateEnabled || !text.trim()) {
      return
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Set options
    utterance.rate = options.rate ?? 0.9
    utterance.pitch = options.pitch ?? 1
    utterance.volume = options.volume ?? 0.8
    
    if (options.voice) {
      utterance.voice = options.voice
    }

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }

    utterance.onpause = () => {
      setIsSpeaking(false)
    }

    utterance.onresume = () => {
      setIsSpeaking(true)
    }

    // Store reference and speak
    currentUtteranceRef.current = utterance
    speechSynthesis.speak(utterance)
  }, [isSupported, narrateEnabled, setIsSpeaking])

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }
  }, [isSupported, setIsSpeaking])

  const pause = useCallback(() => {
    if (isSupported && speechSynthesis.speaking) {
      speechSynthesis.pause()
    }
  }, [isSupported])

  const resume = useCallback(() => {
    if (isSupported && speechSynthesis.paused) {
      speechSynthesis.resume()
    }
  }, [isSupported])

  // Get available voices
  const getVoices = useCallback((): SpeechSynthesisVoice[] => {
    if (!isSupported) return []
    return speechSynthesis.getVoices()
  }, [isSupported])

  // Auto-pause when component unmounts or narration is disabled
  useEffect(() => {
    if (!narrateEnabled && isSpeaking) {
      stop()
    }
  }, [narrateEnabled, isSpeaking, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        speechSynthesis.cancel()
      }
    }
  }, [isSupported])

  return {
    speak,
    stop,
    pause,
    resume,
    getVoices,
    isSupported,
    isSpeaking,
    narrateEnabled
  }
}
