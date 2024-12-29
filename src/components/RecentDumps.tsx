import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface Dump {
  id: string
  title: string
  region: string
  system: {
    shortName: string
  }
  dateAdded: string
  discNumber?: string
  label?: string
}

async function getRecentDumps() {
  'use server'
  
  try {
    const dumps = await prisma.dump.findMany({
      where: {
        isNew: true
      },
      take: 10,
      orderBy: {
        dateAdded: 'desc',
      },
      include: {
        system: true,
      },
    })
    return dumps
  } catch (error) {
    console.error('Error fetching dumps:', error)
    return []
  }
}

export default async function RecentDumps() {
  const dumps = await getRecentDumps()

  if (!dumps.length) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
        No dumps available
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <ul className="divide-y divide-gray-200">
        {dumps.map((dump) => (
          <li key={dump.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {formatDate(dump.dateAdded)}
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {dump.region}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <Link 
                  href={`/discs/${dump.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  [{dump.system.shortName}] {dump.title}
                  {dump.discNumber && ` (Disc ${dump.discNumber})`}
                  {dump.label && ` (${dump.label})`}
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="p-4 border-t">
        <Link 
          href="/discs?sort=added&dir=desc"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          More...
        </Link>
      </div>
    </div>
  )
}
