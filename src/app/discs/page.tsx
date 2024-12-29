import { PrismaClient } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getDiscs(
  searchParams: { [key: string]: string | string[] | undefined }
) {
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'added'
  const dir = typeof searchParams.dir === 'string' ? searchParams.dir : 'desc'
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
  const perPage = 20

  const where = {}
  const orderBy: any = {}

  // Handle sorting
  switch (sort) {
    case 'title':
      orderBy.title = dir
      break
    case 'system':
      orderBy.system = { shortName: dir }
      break
    case 'region':
      orderBy.region = dir
      break
    case 'added':
    default:
      orderBy.dateAdded = dir
      break
  }

  const discs = await prisma.dump.findMany({
    where,
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      system: true,
      submitter: {
        select: {
          username: true,
        },
      },
    },
  })

  const total = await prisma.dump.count({ where })
  const totalPages = Math.ceil(total / perPage)

  return { discs, total, page, totalPages }
}

export default async function DiscsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { discs, total, page, totalPages } = await getDiscs(searchParams)
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'added'
  const dir = typeof searchParams.dir === 'string' ? searchParams.dir : 'desc'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Discs ({total})
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Link
                    href={`/discs?sort=title&dir=${sort === 'title' && dir === 'asc' ? 'desc' : 'asc'}`}
                    className="hover:text-gray-700"
                  >
                    Title
                  </Link>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Link
                    href={`/discs?sort=system&dir=${sort === 'system' && dir === 'asc' ? 'desc' : 'asc'}`}
                    className="hover:text-gray-700"
                  >
                    System
                  </Link>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Link
                    href={`/discs?sort=region&dir=${sort === 'region' && dir === 'asc' ? 'desc' : 'asc'}`}
                    className="hover:text-gray-700"
                  >
                    Region
                  </Link>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Link
                    href={`/discs?sort=added&dir=${sort === 'added' && dir === 'asc' ? 'desc' : 'asc'}`}
                    className="hover:text-gray-700"
                  >
                    Added
                  </Link>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discs.map((disc) => (
                <tr key={disc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/discs/${disc.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {disc.title}
                      {disc.discNumber && ` (Disc ${disc.discNumber})`}
                      {disc.label && ` (${disc.label})`}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {disc.system.shortName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {disc.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(disc.dateAdded)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {disc.submitter.username}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between items-center">
              {page > 1 ? (
                <Link
                  href={`/discs?page=${page - 1}&sort=${sort}&dir=${dir}`}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </Link>
              ) : (
                <button
                  disabled
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-gray-50 cursor-not-allowed"
                >
                  Previous
                </button>
              )}
              <p className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </p>
              {page < totalPages ? (
                <Link
                  href={`/discs?page=${page + 1}&sort=${sort}&dir=${dir}`}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </Link>
              ) : (
                <button
                  disabled
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-gray-50 cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
