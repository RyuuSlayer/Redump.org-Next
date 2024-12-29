'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
});

type DiscFormData = z.infer<typeof discSchema>;

interface DiscFormProps {
  initialData?: DiscFormData;
  onSubmit: (data: DiscFormData) => Promise<void>;
  systems: Array<{ id: string; name: string; shortName: string }>;
  isEdit?: boolean;
}

export default function DiscForm({ initialData, onSubmit, systems, isEdit = false }: DiscFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

        <div>
          <label htmlFor="discNumber" className="block text-sm font-medium text-gray-700">
            Disc Number
          </label>
          <input
            type="text"
            id="discNumber"
            {...register('discNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.discNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.discNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700">
            Label
          </label>
          <input
            type="text"
            id="label"
            {...register('label')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.label && (
            <p className="mt-1 text-sm text-red-600">{errors.label.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Region
          </label>
          <select
            id="region"
            {...register('region')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a region</option>
            <option value="USA">USA</option>
            <option value="EUR">Europe</option>
            <option value="JPN">Japan</option>
          </select>
          {errors.region && (
            <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Protection Features
          </label>
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
        </div>

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
          {errors.comments && (
            <p className="mt-1 text-sm text-red-600">{errors.comments.message}</p>
          )}
        </div>
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
