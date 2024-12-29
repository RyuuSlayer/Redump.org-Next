import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import EditDumpForm from './EditDumpForm';

async function getDump(id: string) {
  const dump = await prisma.dump.findUnique({
    where: {
      id: id,
    },
    include: {
      system: true,
    },
  });

  if (!dump) {
    notFound();
  }

  return dump;
}

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

export default async function EditDiscPage({ params }: { params: { id: string } }) {
  const [dump, systems] = await Promise.all([
    getDump(params.id),
    getSystems(),
  ]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Dump: {dump.title}</h1>
      <Suspense fallback={<div>Loading form...</div>}>
        <EditDumpForm dump={dump} systems={systems} />
      </Suspense>
    </div>
  );
}
