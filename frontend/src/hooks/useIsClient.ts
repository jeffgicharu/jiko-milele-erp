import { useState, useEffect } from 'react'

/**
 * Hook to detect if we're running on the client side
 * Prevents hydration mismatches by ensuring consistent rendering
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}