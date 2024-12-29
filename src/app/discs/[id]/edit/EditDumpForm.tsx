'use client';

import { useRouter } from 'next/navigation';
import DiscForm from '@/components/DiscForm';
import { System, Dump } from '@prisma/client';

interface EditDumpFormProps {
  dump: Dump;
  systems: System[];
}

export default function EditDumpForm({ dump, systems }: EditDumpFormProps) {
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`/api/dumps/${dump.id}`, {
        method: 'PUT',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to update dump');
      }

      const updatedDump = await response.json();
      router.push(`/discs/${updatedDump.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating dump:', error);
    }
  };

  return (
    <DiscForm
      initialData={{
        title: dump.title,
        region: dump.region,
        languages: dump.languages,
        status: dump.status,
        discNumber: dump.discNumber || '',
        label: dump.label || '',
        systemId: dump.systemId,
        comments: dump.comments || '',
        libCrypt: dump.libCrypt,
        edc: dump.edc,
        antiModchip: dump.antiModchip,
      }}
      systems={systems}
      onSubmit={handleSubmit}
      isEdit
    />
  );
}
