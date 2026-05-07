import { useRef, useCallback } from 'react'
import { useLocalStorage } from '@/shared/lib/hooks/useLocalStorage'
import { useOnClickOutside } from '@/shared/lib/hooks/useOnClickOutside'

export const useAsideState = () => {
  const asideRef = useRef<HTMLDivElement>(null)
  const [compact, setCompact] = useLocalStorage('aside-open', true)

  const handleClose = useCallback(() => {
    setCompact(true)
  }, [setCompact])

  useOnClickOutside(asideRef, handleClose)

  return {
    asideRef,
    compact,
    handleClose,
  }
}
