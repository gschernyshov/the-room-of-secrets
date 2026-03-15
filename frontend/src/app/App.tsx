import { createAppRouter } from '@/app/router'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={createAppRouter()} />
    </AuthProvider>
  )
}

export default App
