import { formatDate } from '@/lib/utils'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function NewsList() {
  const topics = await prisma.topic.findMany({
    where: {
      forumId: 2, // News forum ID
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
    include: {
      posts: {
        take: 1,
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  })

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Latest News</h2>
      <div className="space-y-4">
        {topics.map((topic) => {
          const firstPost = topic.posts[0]
          return (
            <div key={topic.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <h3 className="text-lg font-medium text-gray-900">
                <Link href={`/forum/topic/${topic.id}`} className="hover:text-blue-600">
                  {topic.title}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {firstPost?.content}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                Posted by {firstPost?.author.username} on {formatDate(topic.createdAt)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
