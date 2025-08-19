'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAnnouncer, useSkipLinks } from '@/hooks/useKeyboardNavigation'

interface AccessibilityContextType {
  announceMessage: (message: string, priority?: 'polite' | 'assertive') => void
  addSkipLink: (targetId: string, label: string) => void
  preferences: {
    reducedMotion: boolean
    highContrast: boolean
    largeText: boolean
  }
  updatePreferences: (preferences: Partial<AccessibilityContextType['preferences']>) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

interface AccessibilityProviderProps {
  children: React.ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const { announce } = useAnnouncer()
  const { addSkipLink } = useSkipLinks()
  
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
  })
  
  // Detect user preferences on mount
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem('accessibility-preferences')
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences({
          reducedMotion: prefersReducedMotion || parsed.reducedMotion,
          highContrast: prefersHighContrast || parsed.highContrast,
          largeText: parsed.largeText || false,
        })
      } catch {
        // Use system preferences if parsing fails
        setPreferences(prev => ({
          ...prev,
          reducedMotion: prefersReducedMotion,
          highContrast: prefersHighContrast,
        }))
      }
    } else {
      setPreferences(prev => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast,
      }))
    }
  }, [])
  
  // Apply preferences to document
  useEffect(() => {
    const root = document.documentElement
    
    // Apply reduced motion
    if (preferences.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms')
      root.style.setProperty('--transition-duration', '0.01ms')
    } else {
      root.style.removeProperty('--animation-duration')
      root.style.removeProperty('--transition-duration')
    }
    
    // Apply high contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Apply large text
    if (preferences.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }
    
    // Save preferences to localStorage
    localStorage.setItem('accessibility-preferences', JSON.stringify(preferences))
  }, [preferences])
  
  const updatePreferences = (newPreferences: Partial<typeof preferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }))
  }
  
  const announceMessage = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announce(message, priority)
  }
  
  // Add default skip links
  useEffect(() => {
    addSkipLink('main-content', 'Skip to main content')
    addSkipLink('navigation', 'Skip to navigation')
  }, [addSkipLink])
  
  const contextValue: AccessibilityContextType = {
    announceMessage,
    addSkipLink,
    preferences,
    updatePreferences,
  }
  
  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  )
}

// Accessibility CSS styles
const accessibilityStyles = `
  /* High contrast mode */
  .high-contrast {
    --color-primary: #000000;
    --color-secondary: #ffffff;
    --color-accent: #ffff00;
    --color-error: #ff0000;
    --color-success: #00ff00;
    --color-warning: #ff8800;
    --color-info: #0088ff;
  }
  
  .high-contrast * {
    border-color: currentColor !important;
  }
  
  .high-contrast button,
  .high-contrast input,
  .high-contrast select,
  .high-contrast textarea {
    border: 2px solid currentColor !important;
  }
  
  /* Large text mode */
  .large-text {
    font-size: 120%;
  }
  
  .large-text h1 { font-size: 2.5rem; }
  .large-text h2 { font-size: 2rem; }
  .large-text h3 { font-size: 1.75rem; }
  .large-text h4 { font-size: 1.5rem; }
  .large-text h5 { font-size: 1.25rem; }
  .large-text h6 { font-size: 1.125rem; }
  
  /* Focus indicators */
  *:focus {
    outline: 2px solid var(--color-accent, #ff6600);
    outline-offset: 2px;
  }
  
  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  
  /* Skip links */
  .skip-links a:focus {
    clip: auto;
    left: 6px;
    top: 6px;
    width: auto;
    height: auto;
    z-index: 1000;
  }
`

// Component to inject accessibility styles
export function AccessibilityStyles() {
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = accessibilityStyles
    document.head.appendChild(styleElement)
    
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])
  
  return null
}

// Hook to announce route changes for screen readers
export function useRouteAnnouncement() {
  const { announceMessage } = useAccessibility()
  
  const announceRouteChange = (pageName: string) => {
    announceMessage(`Navigated to ${pageName}`, 'assertive')
  }
  
  return { announceRouteChange }
}

// Component wrapper that adds proper ARIA landmarks
interface LandmarkProps {
  children: React.ReactNode
  as?: 'main' | 'nav' | 'aside' | 'header' | 'footer' | 'section'
  label?: string
  className?: string
}

export function Landmark({ 
  children, 
  as = 'section', 
  label,
  className = ''
}: LandmarkProps) {
  const Element = as
  
  return (
    <Element
      className={className}
      aria-label={label}
      role={as === 'section' ? 'region' : undefined}
    >
      {children}
    </Element>
  )
}

// Accessible heading component that maintains proper hierarchy
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  id?: string
}

export function Heading({ level, children, className = '', id }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  
  return React.createElement(
    Tag,
    {
      className: `heading-${level} ${className}`,
      id,
      tabIndex: -1, // Allow programmatic focus for skip links
    },
    children
  )
}