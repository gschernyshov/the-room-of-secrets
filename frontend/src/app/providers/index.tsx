import { type ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { StarsProvider } from './StarsProvider'
import { AuthProvider } from './AuthProvider'

type Props = {
  children: ReactNode
}

export const Providers = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <StarsProvider>
        <AuthProvider>{children}</AuthProvider>
      </StarsProvider>
    </ThemeProvider>
  )
}
