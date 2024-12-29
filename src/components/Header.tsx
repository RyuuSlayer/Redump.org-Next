'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold">
              Redump Database
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link href="/discs" className="hover:text-gray-300">
                Discs
              </Link>
              <Link href="/systems" className="hover:text-gray-300">
                Systems
              </Link>
              <Link href="/guide" className="hover:text-gray-300">
                Guide
              </Link>
              <Link href="/download" className="hover:text-gray-300">
                Download
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm">
                  Welcome, {session.user.username}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm hover:text-gray-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm hover:text-gray-300">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
