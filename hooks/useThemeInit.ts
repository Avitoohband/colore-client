import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

/**
 * Hook to initialize theme from localStorage and sync with DOM
 * This prevents hydration mismatches and ensures theme consistency
 */
export function useThemeInit() {
  const { isDarkMode, toggleDarkMode } = useGameStore()

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    try {
      const storedTheme = localStorage.getItem('theme')
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      
      let shouldBeDark = false
      
      if (storedTheme === 'dark') {
        shouldBeDark = true
      } else if (storedTheme === 'light') {
        shouldBeDark = false
      } else {
        // No stored theme, use system preference
        shouldBeDark = systemPrefersDark
        // Save the detected preference
        localStorage.setItem('theme', shouldBeDark ? 'dark' : 'light')
      }
      
      // Check if DOM and store are in sync
      const htmlHasDark = document.documentElement.classList.contains('dark')
      
      if (shouldBeDark !== isDarkMode || shouldBeDark !== htmlHasDark) {
        // Force sync by toggling if needed
        if (shouldBeDark !== isDarkMode) {
          // Store state doesn't match what it should be
          useGameStore.setState({ isDarkMode: shouldBeDark })
        }
        
        // Ensure DOM is correct
        if (shouldBeDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    } catch (error) {
      console.warn('Failed to initialize theme:', error)
    }
  }, []) // Empty dependency array - only run once on mount

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't explicitly set a theme
      const storedTheme = localStorage.getItem('theme')
      if (!storedTheme || storedTheme === 'system') {
        const shouldBeDark = e.matches
        if (shouldBeDark !== isDarkMode) {
          // Update both store and localStorage
          useGameStore.setState({ isDarkMode: shouldBeDark })
          localStorage.setItem('theme', shouldBeDark ? 'dark' : 'light')
          
          if (shouldBeDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      }
    }

    // Add listener for system theme changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange)
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemThemeChange)
      return () => mediaQuery.removeListener(handleSystemThemeChange)
    }
  }, [isDarkMode])
}
