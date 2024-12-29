'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define track schema
const trackSchema = z.object({
  number: z.number().int().min(1),
  type: z.enum(['data', 'audio']),
  pregap: z.number().int().min(0).default(0),
  size: z.number().int().min(0),
  crc32: z.string().optional(),
  md5: z.string().optional(),
  sha1: z.string().optional(),
  offset: z.number().int().optional(),
  sectors: z.number().int().optional(),
});

// Define the form schema using Zod
const discSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters'),
  region: z.string().min(1, 'Region is required'),
  languages: z.array(z.string()),
  status: z.number().int().min(0),
  discNumber: z.string().optional(),
  label: z.string().optional(),
  systemId: z.string().min(1, 'System is required'),
  comments: z.string().optional(),
  libCrypt: z.boolean().default(false),
  edc: z.boolean().default(false),
  antiModchip: z.boolean().default(false),
  // New fields
  serialNumber: z.string().optional(),
  version: z.string().optional(),
  exeDate: z.string().optional(), // Will be converted to DateTime in API
  publisher: z.string().optional(),
  developer: z.string().optional(),
  barcode: z.string().optional(),
  category: z.number().int().default(0),
  innerRingCode: z.string().optional(),
  outerRingCode: z.string().optional(),
  mouldSID: z.string().optional(),
  tracks: z.array(trackSchema).optional(),
});

type DiscFormData = z.infer<typeof discSchema>;
type TrackData = z.infer<typeof trackSchema>;

interface DiscFormProps {
  initialData?: DiscFormData;
  onSubmit: (data: DiscFormData) => Promise<void>;
  systems: Array<{ id: string; name: string; shortName: string }>;
  isEdit?: boolean;
}

export default function DiscForm({ initialData, onSubmit, systems, isEdit = false }: DiscFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tracks, setTracks] = useState<TrackData[]>(initialData?.tracks || []);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DiscFormData>({
    resolver: zodResolver(discSchema),
    defaultValues: initialData,
  });

  const selectedSystem = watch('systemId');

  const handleFormSubmit = async (data: DiscFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, tracks });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTrack = () => {
    setTracks([...tracks, {
      number: tracks.length + 1,
      type: 'data',
      pregap: 0,
      size: 0,
    }]);
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  const updateTrack = (index: number, field: keyof TrackData, value: any) => {
    const newTracks = [...tracks];
    newTracks[index] = { ...newTracks[index], [field]: value };
    setTracks(newTracks);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Basic Information */}
        <fieldset className="border rounded-md p-4">
          <legend className="text-lg font-medium">Basic Information</legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="systemId" className="block text-sm font-medium text-gray-700">
                System
              </label>
              <select
                id="systemId"
                {...register('systemId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={isEdit}
              >
                <option value="">Select a system</option>
                {systems.map((system) => (
                  <option key={system.id} value={system.id}>
                    {system.name}
                  </option>
                ))}
              </select>
              {errors.systemId && (
                <p className="mt-1 text-sm text-red-600">{errors.systemId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register('title')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                  Serial Number
                </label>
                <input
                  type="text"
                  id="serialNumber"
                  {...register('serialNumber')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700">
                  Version
                </label>
                <input
                  type="text"
                  id="version"
                  {...register('version')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
                  Publisher
                </label>
                <input
                  type="text"
                  id="publisher"
                  {...register('publisher')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="developer" className="block text-sm font-medium text-gray-700">
                  Developer
                </label>
                <input
                  type="text"
                  id="developer"
                  {...register('developer')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Ring Code Information */}
        <fieldset className="border rounded-md p-4">
          <legend className="text-lg font-medium">Ring Code Information</legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="innerRingCode" className="block text-sm font-medium text-gray-700">
                Inner Ring Code
              </label>
              <input
                type="text"
                id="innerRingCode"
                {...register('innerRingCode')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="outerRingCode" className="block text-sm font-medium text-gray-700">
                Outer Ring Code
              </label>
              <input
                type="text"
                id="outerRingCode"
                {...register('outerRingCode')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="mouldSID" className="block text-sm font-medium text-gray-700">
                Mould SID
              </label>
              <input
                type="text"
                id="mouldSID"
                {...register('mouldSID')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </fieldset>

        {/* Track Information */}
        <fieldset className="border rounded-md p-4">
          <legend className="text-lg font-medium">Track Information</legend>
          <div className="space-y-4">
            {tracks.map((track, index) => (
              <div key={index} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">Track {track.number}</h4>
                  <button
                    type="button"
                    onClick={() => removeTrack(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      value={track.type}
                      onChange={(e) => updateTrack(index, 'type', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="data">Data</option>
                      <option value="audio">Audio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Size
                    </label>
                    <input
                      type="number"
                      value={track.size}
                      onChange={(e) => updateTrack(index, 'size', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pregap
                    </label>
                    <input
                      type="number"
                      value={track.pregap}
                      onChange={(e) => updateTrack(index, 'pregap', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CRC32
                    </label>
                    <input
                      type="text"
                      value={track.crc32 || ''}
                      onChange={(e) => updateTrack(index, 'crc32', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTrack}
              className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Track
            </button>
          </div>
        </fieldset>

        {/* Protection Features */}
        <fieldset className="border rounded-md p-4">
          <legend className="text-lg font-medium">Protection Features</legend>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="libCrypt"
                {...register('libCrypt')}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="libCrypt" className="ml-2 text-sm text-gray-700">
                LibCrypt Protection
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="edc"
                {...register('edc')}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="edc" className="ml-2 text-sm text-gray-700">
                EDC Protection
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="antiModchip"
                {...register('antiModchip')}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="antiModchip" className="ml-2 text-sm text-gray-700">
                Anti-Modchip Protection
              </label>
            </div>
          </div>
        </fieldset>

        {/* Additional Information */}
        <fieldset className="border rounded-md p-4">
          <legend className="text-lg font-medium">Additional Information</legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <textarea
                id="comments"
                {...register('comments')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </fieldset>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Dump' : 'Add Dump'}
        </button>
      </div>
    </form>
  );
}
