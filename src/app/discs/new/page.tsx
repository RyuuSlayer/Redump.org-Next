import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import NewDumpForm from './NewDumpForm';

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
  });
  return systems;
}

export default async function NewDiscPage() {
  const systems = await getSystems();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Add New Dump</h1>
      <Suspense fallback={<div>Loading form...</div>}>
        <NewDumpForm systems={systems} />
      </Suspense>
    </div>
  );
}
