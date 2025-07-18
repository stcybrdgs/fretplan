'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark' // Set dark as default
      enableSystem={false} // Disable system preference detection
      storageKey='frettime-theme' // custom key to avoid domain clashes on localStorage
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  )
}

