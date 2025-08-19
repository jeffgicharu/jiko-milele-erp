import { useCallback, useEffect, useRef } from 'react'

interface KeyboardNavigationOptions {
  enabled?: boolean
  loop?: boolean
  focusOnMount?: boolean
  onEscape?: () => void
  onEnter?: (activeIndex: number) => void
  onSelect?: (activeIndex: number) => void
}

export function useKeyboardNavigation(
  itemCount: number,
  options: KeyboardNavigationOptions = {}
) {
  const {
    enabled = true,
    loop = true,
    focusOnMount = false,
    onEscape,
    onEnter,
    onSelect,
  } = options

  const activeIndexRef = useRef(-1)
  const containerRef = useRef<HTMLElement>(null)
  
  const setActiveIndex = useCallback((index: number) => {
    if (!enabled) return
    
    let newIndex = index
    
    if (loop) {
      if (newIndex < 0) {
        newIndex = itemCount - 1
      } else if (newIndex >= itemCount) {
        newIndex = 0
      }
    } else {
      newIndex = Math.max(0, Math.min(newIndex, itemCount - 1))
    }
    
    activeIndexRef.current = newIndex
    
    // Update focus if container ref is available
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll('[data-keyboard-nav]')
      const activeItem = items[newIndex] as HTMLElement
      activeItem?.focus()
    }
  }, [enabled, itemCount, loop])
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || itemCount === 0) return
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex(activeIndexRef.current + 1)
        break
        
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex(activeIndexRef.current - 1)
        break
        
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
        
      case 'End':
        event.preventDefault()
        setActiveIndex(itemCount - 1)
        break
        
      case 'Enter':
      case ' ':
        event.preventDefault()
        const currentIndex = activeIndexRef.current
        if (currentIndex >= 0) {
          onEnter?.(currentIndex)
          onSelect?.(currentIndex)
        }
        break
        
      case 'Escape':
        event.preventDefault()
        onEscape?.()
        break
        
      default:
        // Letter navigation
        if (event.key.length === 1 && /[a-zA-Z0-9]/.test(event.key)) {
          // Find first item that starts with this letter
          if (containerRef.current) {
            const items = containerRef.current.querySelectorAll('[data-keyboard-nav]')
            const letter = event.key.toLowerCase()
            
            for (let i = 0; i < items.length; i++) {
              const item = items[i] as HTMLElement
              const text = item.textContent?.toLowerCase() || ''
              if (text.startsWith(letter)) {
                setActiveIndex(i)
                break
              }
            }
          }
        }
    }
  }, [enabled, itemCount, setActiveIndex, onEnter, onSelect, onEscape])
  
  useEffect(() => {
    if (!enabled) return
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])
  
  useEffect(() => {
    if (focusOnMount && enabled && itemCount > 0) {
      setActiveIndex(0)
    }
  }, [focusOnMount, enabled, itemCount, setActiveIndex])
  
  return {
    activeIndex: activeIndexRef.current,
    setActiveIndex,
    containerRef,
  }
}

// Hook for focus management
export function useFocusManagement() {
  const previousFocusRef = useRef<HTMLElement | null>(null)
  
  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
  }, [])
  
  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [])
  
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable.focus()
        }
      }
    }
    
    container.addEventListener('keydown', handleTabKey)
    
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [])
  
  return {
    saveFocus,
    restoreFocus,
    trapFocus,
  }
}

// Hook for accessible announcements
export function useAnnouncer() {
  const announcerRef = useRef<HTMLDivElement | null>(null)
  
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcerRef.current) {
      // Create announcer element if it doesn't exist
      const announcer = document.createElement('div')
      announcer.setAttribute('aria-live', priority)
      announcer.setAttribute('aria-atomic', 'true')
      announcer.style.position = 'absolute'
      announcer.style.left = '-10000px'
      announcer.style.width = '1px'
      announcer.style.height = '1px'
      announcer.style.overflow = 'hidden'
      document.body.appendChild(announcer)
      announcerRef.current = announcer
    }
    
    // Update aria-live if priority changed
    if (announcerRef.current.getAttribute('aria-live') !== priority) {
      announcerRef.current.setAttribute('aria-live', priority)
    }
    
    // Clear and set new message
    announcerRef.current.textContent = ''
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message
      }
    }, 100)
  }, [])
  
  useEffect(() => {
    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current)
        announcerRef.current = null
      }
    }
  }, [])
  
  return { announce }
}

// Hook for skip links
export function useSkipLinks() {
  const skipLinksRef = useRef<HTMLDivElement | null>(null)
  
  const addSkipLink = useCallback((targetId: string, label: string) => {
    if (!skipLinksRef.current) {
      const skipLinks = document.createElement('div')
      skipLinks.className = 'skip-links'
      skipLinks.style.position = 'absolute'
      skipLinks.style.top = '-40px'
      skipLinks.style.left = '6px'
      skipLinks.style.zIndex = '1000'
      document.body.appendChild(skipLinks)
      skipLinksRef.current = skipLinks
    }
    
    const existingLink = skipLinksRef.current.querySelector(`[href="#${targetId}"]`)
    if (!existingLink) {
      const skipLink = document.createElement('a')
      skipLink.href = `#${targetId}`
      skipLink.textContent = label
      skipLink.className = 'skip-link'
      skipLink.style.display = 'inline-block'
      skipLink.style.padding = '8px 12px'
      skipLink.style.backgroundColor = '#000'
      skipLink.style.color = '#fff'
      skipLink.style.textDecoration = 'none'
      skipLink.style.borderRadius = '4px'
      skipLink.style.marginRight = '8px'
      skipLink.style.transition = 'transform 0.3s'
      
      skipLink.addEventListener('focus', () => {
        skipLink.style.transform = 'translateY(40px)'
      })
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.transform = 'translateY(0)'
      })
      
      skipLinksRef.current.appendChild(skipLink)
    }
  }, [])
  
  useEffect(() => {
    return () => {
      if (skipLinksRef.current) {
        document.body.removeChild(skipLinksRef.current)
        skipLinksRef.current = null
      }
    }
  }, [])
  
  return { addSkipLink }
}