'use client';

import { useRouter } from 'next/navigation';
import DiscForm from '@/components/DiscForm';
import { System, Dump, Track } from '@prisma/client';

interface EditDumpFormProps {
  dump: Dump & { tracks: Track[] };
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
        serialNumber: dump.serialNumber || '',
        version: dump.version || '',
        exeDate: dump.exeDate ? dump.exeDate.toISOString().split('T')[0] : '',
        publisher: dump.publisher || '',
        developer: dump.developer || '',
        barcode: dump.barcode || '',
        category: dump.category,
        innerRingCode: dump.innerRingCode || '',
        outerRingCode: dump.outerRingCode || '',
        mouldSID: dump.mouldSID || '',
        tracks: dump.tracks.map(track => ({
          number: track.number,
          type: track.type,
          pregap: track.pregap,
          size: track.size.toString(),
          crc32: track.crc32 || '',
          md5: track.md5 || '',
          sha1: track.sha1 || '',
          offset: track.offset || 0,
          sectors: track.sectors || 0,
        })),
      }}
      systems={systems}
      onSubmit={handleSubmit}
      isEdit
    />
  );
}
