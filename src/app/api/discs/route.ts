import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const system = searchParams.get('system')
  const region = searchParams.get('region')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'dateAdded'
  const dir = searchParams.get('dir') || 'desc'

  const where = {
    ...(system && { systemId: system }),
    ...(region && { region }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { comments: { contains: search, mode: 'insensitive' } },
      ],
    }),
  }

  const [dumps, total] = await Promise.all([
    prisma.dump.findMany({
      where,
      include: {
        system: true,
        submitter: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        [sort]: dir,
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.dump.count({ where }),
  ])

  return NextResponse.json({
    dumps,
    total,
    pages: Math.ceil(total / limit),
  })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const data = await req.json()

  try {
    const dump = await prisma.dump.create({
      data: {
        title: data.title,
        region: data.region,
        languages: data.languages,
        status: data.status || 0,
        discNumber: data.discNumber,
        label: data.label,
        comments: data.comments,
        libCrypt: data.libCrypt || false,
        edc: data.edc || false,
        antiModchip: data.antiModchip || false,
        error: data.error,
        system: {
          connect: { id: data.systemId },
        },
        submitter: {
          connect: { id: session.user.id },
        },
        tracks: {
          create: data.tracks.map((track: any) => ({
            number: track.number,
            type: track.type,
            pregap: track.pregap || 0,
            size: track.size,
            crc32: track.crc32,
            md5: track.md5,
            sha1: track.sha1,
            offset: track.offset,
            sectors: track.sectors,
          })),
        },
        ringCodes: {
          create: data.ringCodes?.map((code: any) => ({
            type: code.type,
            value: code.value,
          })),
        },
      },
      include: {
        system: true,
        tracks: true,
        ringCodes: true,
      },
    })

    return NextResponse.json(dump)
  } catch (error) {
    console.error('Error creating dump:', error)
    return new Response('Error creating dump', { status: 500 })
  }
}
