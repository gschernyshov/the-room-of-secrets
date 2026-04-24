import { useRef, useCallback } from 'react'
import { useLocalStorage } from '@/shared/lib/hooks/useLocalStorage'
import { useOnClickOutside } from '@/shared/lib/hooks/useOnClickOutside'

export const useAsideState = () => {
  const asideRef = useRef<HTMLDivElement>(null)
  const [compact, setCompact] = useLocalStorage('aside-open', true)

  const handleClose = useCallback(() => {
    if (compact) return
    setCompact(true)
  }, [compact, setCompact])

  useOnClickOutside(asideRef, handleClose)

  return {
    asideRef,
    compact,
    setCompact,
  }
}
