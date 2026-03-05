import { createAppRouter } from '@/app/router'
import { RouterProvider } from 'react-router-dom'

const App = () => {
  return <RouterProvider router={createAppRouter()} />
}

export default App
