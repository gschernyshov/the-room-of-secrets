import { Outlet } from 'react-router-dom'
import { RouteTitleSetter } from '../router/ui/RouteTitleSetter'
import { AsideHeader } from '@/widgets/asideHeader'
import { GlobalAlert } from '@/widgets/globalAlert'

export const AppLayout = () => {
  return (
    <>
      <AsideHeader />
      <main>
        <RouteTitleSetter />
        <Outlet />
      </main>
      <GlobalAlert />
    </>
  )
}
