import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import { ReduxProvider } from '@/redux/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotlite - Discover the best spots for street performing in real-time',
  description: 'A busking platform for downtowns',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
