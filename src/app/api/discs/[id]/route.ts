import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const dump = await prisma.dump.findUnique({
    where: { id: params.id },
    include: {
      system: true,
      submitter: {
        select: {
          username: true,
        },
      },
      tracks: true,
      ringCodes: true,
    },
  })

  if (!dump) {
    return new Response('Not found', { status: 404 })
  }

  return NextResponse.json(dump)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const data = await req.json()

  try {
    const dump = await prisma.dump.update({
      where: { id: params.id },
      data: {
        title: data.title,
        region: data.region,
        languages: data.languages,
        status: data.status,
        discNumber: data.discNumber,
        label: data.label,
        comments: data.comments,
        libCrypt: data.libCrypt,
        edc: data.edc,
        antiModchip: data.antiModchip,
        error: data.error,
        system: {
          connect: { id: data.systemId },
        },
        tracks: {
          deleteMany: {},
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
          deleteMany: {},
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
    console.error('Error updating dump:', error)
    return new Response('Error updating dump', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.role === 'ADMIN') {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    await prisma.dump.delete({
      where: { id: params.id },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting dump:', error)
    return new Response('Error deleting dump', { status: 500 })
  }
}
