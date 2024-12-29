import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const recentDumps = await prisma.dump.findMany({
      take: 10,
      orderBy: {
        dateAdded: 'desc',
      },
      include: {
        system: true,
      },
    })

    return NextResponse.json(
      recentDumps.map((dump) => ({
        id: dump.id,
        title: dump.title,
        region: dump.region,
        system: dump.system.shortName,
        dateAdded: dump.dateAdded.toISOString(),
        discNumber: dump.discNumber,
        label: dump.label,
      }))
    )
  } catch (error) {
    console.error('Error fetching recent dumps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent dumps' },
      { status: 500 }
    )
  }
}
