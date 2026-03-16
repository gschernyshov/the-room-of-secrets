import { RouterProvider } from 'react-router-dom'
import { Providers } from './providers'
import { createAppRouter } from '@/app/router'

const App = () => {
  return (
    <Providers>
      <RouterProvider router={createAppRouter()} />
    </Providers>
  )
}

export default App
