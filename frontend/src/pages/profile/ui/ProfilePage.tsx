import { useSessionStore } from '@/entities/session/model/store'

export const ProfilePage = () => {
  const user = useSessionStore(state => state.user)

  return <div>{user && <p>{JSON.stringify(user)}</p>}</div>
}
