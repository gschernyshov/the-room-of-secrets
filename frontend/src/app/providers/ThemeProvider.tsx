import type { ReactNode } from 'react'
import { ThemeProvider as GravityThemeProvider } from '@gravity-ui/uikit'
import '@gravity-ui/uikit/styles/fonts.css'
import '@gravity-ui/uikit/styles/styles.css'

type Props = {
  children: ReactNode
}

export const ThemeProvider = ({ children }: Props) => {
  return <GravityThemeProvider theme="dark">{children}</GravityThemeProvider>
}
