import { createBrowserRouter } from 'react-router-dom'
import { routeConfig } from '../routes'

export const createAppRouter = () => {
  return createBrowserRouter(routeConfig)
}
