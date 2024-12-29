import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import NewDumpForm from './NewDumpForm'

async function getSystems() {
  const systems = await prisma.system.findMany({
    select: {
      id: true,
      name: true,
      shortName: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
  return systems
}

export default async function NewDiscPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === 'ADMIN'

  if (!isAdmin) {
    redirect('/')
  }

  const systems = await getSystems()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">New Disc</h1>
      <Suspense fallback={<div>Loading form...</div>}>
        <NewDumpForm systems={systems} />
      </Suspense>
    </div>
  )
}
