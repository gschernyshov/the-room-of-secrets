import { type ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { StarsProvider } from './StarsProvider'
import { AuthProvider } from './AuthProvider'
import { SocketProvider } from './SocketProvider'

type Props = {
  children: ReactNode
}

export const Providers = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <StarsProvider>
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </AuthProvider>
      </StarsProvider>
    </ThemeProvider>
  )
}
