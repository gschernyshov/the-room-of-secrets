import { createBrowserRouter } from 'react-router-dom'
import { routeConfig } from '../routes'
import { AppLayout } from '@/app/layouts/AppLayout'

export const createAppRouter = () => {
  return createBrowserRouter([
    {
      element: <AppLayout />,
      children: routeConfig,
    },
  ])
}
