import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateDatFile } from '@/lib/disc-utils'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const dump = await prisma.dump.findUnique({
    where: { id: params.id },
    include: {
      system: true,
      tracks: true,
    },
  })

  if (!dump) {
    return new Response('Not found', { status: 404 })
  }

  const datFile = generateDatFile(dump)
  return new Response(datFile, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Disposition': `attachment; filename="${dump.title}.dat"`,
    },
  })
}
