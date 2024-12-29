import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Redump Database',
  description: 'A modern database for game preservation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <SessionProvider>
          <Header />
          <div className="container mx-auto px-4 py-8">
            <main>{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
