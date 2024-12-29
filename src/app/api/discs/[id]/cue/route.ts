import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateCueSheet } from '@/lib/disc-utils'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const dump = await prisma.dump.findUnique({
    where: { id: params.id },
    include: {
      tracks: true,
    },
  })

  if (!dump) {
    return new Response('Not found', { status: 404 })
  }

  const cueSheet = generateCueSheet(dump)
  return new Response(cueSheet, {
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="${dump.title}.cue"`,
    },
  })
}
