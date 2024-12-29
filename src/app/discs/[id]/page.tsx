import { PrismaClient } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

async function getDumpDetails(id: string) {
  const dump = await prisma.dump.findUnique({
    where: { id },
    include: {
      system: true,
      submitter: {
        select: {
          id: true,
          username: true,
        },
      },
      tracks: true,
      ringCode: true,
    },
  })

  if (!dump) {
    notFound()
  }

  return dump
}

export default async function DiscPage({ params }: { params: { id: string } }) {
  const dump = await getDumpDetails(params.id)
  const session = await auth()
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{dump.title}</h1>
          {isAdmin && (
            <div>
              <Link
                href={`/discs/${dump.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Game Information
            </h2>
            <dl className="grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">System</dt>
              <dd className="text-sm text-gray-900 col-span-2">{dump.system.name}</dd>

              <dt className="text-sm font-medium text-gray-500">Region</dt>
              <dd className="text-sm text-gray-900 col-span-2">{dump.region}</dd>

              {dump.languages?.length > 0 && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Languages</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {dump.languages.join(', ')}
                  </dd>
                </>
              )}

              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                {dump.status === 2 ? 'Verified' : 'Unverified'}
              </dd>

              <dt className="text-sm font-medium text-gray-500">Added By</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                {dump.submitter.username}
              </dd>

              <dt className="text-sm font-medium text-gray-500">Added</dt>
              <dd className="text-sm text-gray-900 col-span-2">
                {formatDate(dump.dateAdded)}
              </dd>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Disc Information
            </h2>
            <dl className="grid grid-cols-3 gap-4">
              {dump.discNumber && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Disc Number</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{dump.discNumber}</dd>
                </>
              )}

              {dump.label && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Label</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{dump.label}</dd>
                </>
              )}

              {dump.ringCode && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Ring Code</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {dump.ringCode.type}: {dump.ringCode.value}
                  </dd>
                </>
              )}

              {dump.libCrypt && (
                <>
                  <dt className="text-sm font-medium text-gray-500">LibCrypt</dt>
                  <dd className="text-sm text-gray-900 col-span-2">Yes</dd>
                </>
              )}

              {dump.edc && (
                <>
                  <dt className="text-sm font-medium text-gray-500">EDC</dt>
                  <dd className="text-sm text-gray-900 col-span-2">Yes</dd>
                </>
              )}

              {dump.antiModchip && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Anti-modchip</dt>
                  <dd className="text-sm text-gray-900 col-span-2">Yes</dd>
                </>
              )}
            </dl>
          </div>
        </div>

        {dump.comments && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Comments</h2>
            <p className="text-sm text-gray-600">{dump.comments}</p>
          </div>
        )}

        {dump.tracks?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Tracks</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Number
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CRC32
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MD5
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dump.tracks.map((track) => (
                    <tr key={track.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {track.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {track.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {track.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {track.crc32}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {track.md5}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 flex space-x-4">
          <Link
            href={`/api/discs/${dump.id}/cue`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Download CUE
          </Link>
          <Link
            href={`/api/discs/${dump.id}/dat`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Download DAT
          </Link>
        </div>
      </div>
    </div>
  )
}
