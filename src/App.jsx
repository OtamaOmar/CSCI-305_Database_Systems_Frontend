import { RouterProvider } from '@tanstack/react-router'
import { AlertProvider } from './components/AlertProvider'
import { router } from './router'

function App() {
  return (
    <AlertProvider>
      <RouterProvider router={router} />
    </AlertProvider>
  )
}

export default App
