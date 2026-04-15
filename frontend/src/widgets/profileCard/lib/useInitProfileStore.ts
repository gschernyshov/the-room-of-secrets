import { useEffect } from 'react'
import { useProfileCardStore } from '../model/profileCardStore'

export const useInitProfileStore = () => {
  const init = useProfileCardStore(state => state.init)

  useEffect(() => {
    init()
  }, [])
}
