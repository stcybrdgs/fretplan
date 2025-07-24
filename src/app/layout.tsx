import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'FretTime - Guitar Practice Organization Made Simple',
  description:
    'A modern web application designed specifically for guitarists and string musicians to organize practice routines, track progress with built-in timers, and stay motivated. Features real-time session tracking, persistent state management, and responsive design. Built with React, Next.js 14, TypeScript, and Tailwind CSS - showcasing modern full-stack development skills.',

  // Open Graph tags for LinkedIn and other social platforms
  openGraph: {
    title: 'FretTime - Guitar Practice Organization Made Simple',
    description:
      'A modern web application designed specifically for guitarists and string musicians to organize practice routines, track progress with built-in timers, and stay motivated. Features real-time session tracking, persistent state management, and responsive design. Built with React, Next.js 14, TypeScript, and Tailwind CSS - showcasing modern full-stack development.',
    url: 'https://frettime.com',
    siteName: 'FretTime',
    images: [
      {
        url: 'https://frettime.com/frettime-og-image.png',
        width: 1200,
        height: 630,
        alt: 'FretTime guitar practice organization app interface showing practice areas, task cards, and timer functionality',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card optimization (bonus professional touch)
  twitter: {
    card: 'summary_large_image',
    title: 'FretTime - Guitar Practice Organization Made Simple',
    description:
      'Modern guitar practice organization app built with React, Next.js, TypeScript, and Tailwind CSS. Features timers, progress tracking, and responsive design.',
    images: ['https://frettime.com/og-image.png'],
  },

  // SEO and discoverability
  keywords: [
    'guitar practice app',
    'music organization software',
    'practice timer',
    'musician productivity tools',
    'React portfolio project',
    'Next.js application',
    'TypeScript development',
    'full-stack web development',
    'modern JavaScript frameworks',
  ],

  // Author information (crucial for LinkedIn)
  authors: [
    {
      name: 'Stacy Bridges',
      url: 'https://www.linkedin.com/in/stcybrdgs/',
    },
  ],

  // Additional metadata
  category: 'Web Application',
  applicationName: 'FretTime',

  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Additional meta tags for LinkedIn optimization */}
        <meta property='og:locale' content='en_US' />
        <meta name='theme-color' content='#9333ea' />
        <meta name='application-name' content='FretTime' />

        {/* Structured data for better SEO */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'FretTime',
              description:
                'Guitar practice organization web application built with modern React stack',
              url: 'https://frettime.com',
              applicationCategory: 'MusicApplication',
              operatingSystem: 'Web Browser',
              author: {
                '@type': 'Person',
                name: 'Stacy Bridges',
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </head>
      <body className='bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

