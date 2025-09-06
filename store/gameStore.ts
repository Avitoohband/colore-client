import { create } from 'zustand'

export interface Player {
  id: string
  name: string
}

export interface Message {
  sender: string
  content: string
  type: 'story' | 'chat'
  timestamp: number
}

interface GameState {
  players: Player[]
  currentTurn: number
  storyLog: Message[]
  chatLog: Message[]
  isGameStarted: boolean
  isDarkMode: boolean
  narrateEnabled: boolean
  isSpeaking: boolean
  showSetupModal: boolean
  selectedGenre: string
  customBackstory: string
  storyTitle: string
  isGeneratingStory: boolean
  showTranslationModal: boolean
}

interface GameActions {
  addPlayer: (name: string) => void
  removePlayer: (id: string) => void
  addStoryMessage: (sender: string, content: string) => void
  addChatMessage: (sender: string, content: string) => void
  nextTurn: () => void
  startGame: () => void
  resetGame: () => void
  toggleDarkMode: () => void
  toggleNarrate: () => void
  setIsSpeaking: (speaking: boolean) => void
  setShowSetupModal: (show: boolean) => void
  setGameSetup: (mode: 'genre' | 'custom', value: string, title?: string) => void
  setIsGeneratingStory: (generating: boolean) => void
  setShowTranslationModal: (show: boolean) => void
}

type GameStore = GameState & GameActions

// Helper function to get initial theme from localStorage and system preference
const getInitialTheme = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'dark') return true
    if (storedTheme === 'light') return false
    
    // Default to system preference if no theme is stored
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error)
    return false
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  players: [],
  currentTurn: 0,
  storyLog: [],
  chatLog: [],
  isGameStarted: false,
  isDarkMode: getInitialTheme(),
  narrateEnabled: true,
  isSpeaking: false,
  showSetupModal: false,
  selectedGenre: '',
  customBackstory: '',
  storyTitle: '',
  isGeneratingStory: false,
  showTranslationModal: false,

  // Actions
  addPlayer: (name: string) => {
    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim()
    }
    set((state) => ({
      players: [...state.players, newPlayer]
    }))
  },

  removePlayer: (id: string) => {
    set((state) => ({
      players: state.players.filter(player => player.id !== id),
      currentTurn: state.currentTurn >= state.players.length - 1 ? 0 : state.currentTurn
    }))
  },

  addStoryMessage: (sender: string, content: string) => {
    const newMessage: Message = {
      sender,
      content: content.trim(),
      type: 'story',
      timestamp: Date.now()
    }
    set((state) => ({
      storyLog: [...state.storyLog, newMessage]
    }))
  },

  addChatMessage: (sender: string, content: string) => {
    const newMessage: Message = {
      sender,
      content: content.trim(),
      type: 'chat',
      timestamp: Date.now()
    }
    set((state) => ({
      chatLog: [...state.chatLog, newMessage]
    }))
  },

  nextTurn: () => {
    const { players } = get()
    if (players.length > 0) {
      set((state) => ({
        currentTurn: (state.currentTurn + 1) % players.length
      }))
    }
  },

  startGame: () => {
    set({ isGameStarted: true })
  },

  resetGame: () => {
    set({
      players: [],
      currentTurn: 0,
      storyLog: [],
      chatLog: [],
      isGameStarted: false,
      showSetupModal: false,
      selectedGenre: '',
      customBackstory: '',
      storyTitle: '',
      isGeneratingStory: false
    })
  },

  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.isDarkMode
      
      // Apply dark mode to document and save to localStorage
      if (typeof window !== 'undefined') {
        try {
          if (newDarkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
          } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
          }
        } catch (error) {
          console.warn('Failed to save theme to localStorage:', error)
          // Still apply the theme even if localStorage fails
          if (newDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      }
      
      return { isDarkMode: newDarkMode }
    })
  },

  toggleNarrate: () => {
    set((state) => {
      const newNarrateEnabled = !state.narrateEnabled
      
      // If enabling narration, trigger narration of last AI message
      if (newNarrateEnabled && typeof window !== 'undefined') {
        // Find the last AI Narrator message
        const lastAIMessage = [...state.storyLog]
          .reverse()
          .find(message => message.sender === 'AI Narrator')
        
        if (lastAIMessage) {
          // Use setTimeout to ensure the state update happens first
          setTimeout(() => {
            if ('speechSynthesis' in window && window.speechSynthesis) {
              const utterance = new SpeechSynthesisUtterance(lastAIMessage.content)
              utterance.rate = 0.9
              utterance.pitch = 1
              utterance.volume = 0.8
              
              utterance.onstart = () => {
                // Update isSpeaking state
                const currentState = get()
                if (currentState.narrateEnabled) {
                  set({ isSpeaking: true })
                }
              }
              
              utterance.onend = () => {
                set({ isSpeaking: false })
              }
              
              utterance.onerror = () => {
                set({ isSpeaking: false })
              }
              
              window.speechSynthesis.speak(utterance)
            }
          }, 100)
        }
      }
      
      return { narrateEnabled: newNarrateEnabled }
    })
  },

  setIsSpeaking: (speaking: boolean) => {
    set({ isSpeaking: speaking })
  },

  setShowSetupModal: (show: boolean) => {
    set({ showSetupModal: show })
  },

  setGameSetup: (mode: 'genre' | 'custom', value: string, title?: string) => {
    if (mode === 'genre') {
      set({ selectedGenre: value, customBackstory: '', storyTitle: value })
    } else {
      set({ customBackstory: value, selectedGenre: '', storyTitle: title || 'Custom Adventure' })
    }
  },

  setIsGeneratingStory: (generating: boolean) => {
    set({ isGeneratingStory: generating })
  },

  setShowTranslationModal: (show: boolean) => {
    set({ showTranslationModal: show })
  }
}))
