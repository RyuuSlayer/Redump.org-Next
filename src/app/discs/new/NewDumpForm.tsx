'use client';

import { useRouter } from 'next/navigation';
import DiscForm from '@/components/DiscForm';
import { System } from '@prisma/client';

interface NewDumpFormProps {
  systems: System[];
}

export default function NewDumpForm({ systems }: NewDumpFormProps) {
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/dumps', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to create dump');
      }

      const dump = await response.json();
      router.push(`/discs/${dump.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating dump:', error);
    }
  };

  return (
    <DiscForm
      systems={systems}
      onSubmit={handleSubmit}
    />
  );
}
