import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const news = await prisma.post.findMany({
      where: {
        isNews: true,
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json(
      news.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        author: {
          id: item.author.id,
          name: item.author.username,
        },
        postedAt: item.createdAt.toISOString(),
      }))
    )
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
