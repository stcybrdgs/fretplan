import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'FretTime',
  description: 'A time tracker for practicing musicians',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

