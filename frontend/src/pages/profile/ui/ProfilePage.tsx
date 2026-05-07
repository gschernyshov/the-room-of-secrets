import { useEffect } from 'react'
import { ProfileCard } from '@/widgets/profileCard'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'

export const ProfilePage = () => {
  const { searchParams, navigate } = useAppNavigate()
  const activeTab = searchParams.get('activeTab')

  useEffect(() => {
    if (activeTab) navigate('/profile', { replace: true })
  })

  return <ProfileCard tab={activeTab} />
}
