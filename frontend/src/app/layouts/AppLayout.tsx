import { Outlet } from 'react-router-dom'
import { AsideHeader } from '@/widgets/asideHeader'
import { GlobalAlert } from '@/widgets/globalAlert'

export const AppLayout = () => {
  return (
    <>
      <AsideHeader />
      <main>
        <Outlet />
      </main>
      <GlobalAlert />
    </>
  )
}
