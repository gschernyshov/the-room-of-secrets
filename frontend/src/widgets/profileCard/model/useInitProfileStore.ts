import { useEffect } from 'react'
import { useProfileCardStore } from './profileCardStore'

export const useInitProfileStore = () => {
  const init = useProfileCardStore(state => state.init)

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
