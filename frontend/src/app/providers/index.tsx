import type { ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'

type ProvidersProps = {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return <AuthProvider>{children}</AuthProvider>
}
