'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DiscForm from '@/components/DiscForm';
import { System, Dump, Track } from '@prisma/client';

interface EditDumpFormProps {
  dump: Dump & { tracks: Track[] };
  systems: System[];
}

export default function EditDumpForm({ dump, systems }: EditDumpFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    try {
      console.log('EditDumpForm received data:', formData);
      setError(null);

      // Create a new FormData object
      const data = new FormData();

      // Add all the basic fields
      Object.keys(formData).forEach(key => {
        if (key === 'tracks') {
          // Ensure track types are strings
          const tracks = formData.tracks.map((track: any) => ({
            ...track,
            type: track.type === 1 ? 'audio' : 'data'
          }));
          data.append('tracks', JSON.stringify(tracks));
        } else if (Array.isArray(formData[key])) {
          formData[key].forEach((value: string) => {
            data.append(key, value);
          });
        } else if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key].toString());
        }
      });

      console.log('Sending data to API:', {
        method: 'PUT',
        url: `/api/dumps/${dump.id}`,
        formData: Object.fromEntries(data.entries()),
      });

      const response = await fetch(`/api/dumps/${dump.id}`, {
        method: 'PUT',
        body: data,
      });

      console.log('API Response status:', response.status);
      const responseData = await response.json();
      console.log('API Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update dump');
      }

      router.push(`/discs/${responseData.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating dump:', error);
      setError(error instanceof Error ? error.message : 'Failed to update dump');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Dump</h1>
        {error && (
          <div className="mb-4 bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}
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
              type: track.type === 1 ? 'audio' : 'data',
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
      </div>
    </div>
  );
}
