import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const dump = await prisma.dump.update({
      where: {
        id: params.id,
      },
      data: {
        title: title,
        region: formData.get('region') as string,
        languages: [formData.get('languages') as string],
        status: parseInt(formData.get('status') as string),
        discNumber: formData.get('discNumber') as string,
        label: formData.get('label') as string,
        comments: formData.get('comments') as string,
        libCrypt: formData.get('libCrypt') === 'true',
        edc: formData.get('edc') === 'true',
        antiModchip: formData.get('antiModchip') === 'true',
      },
    });

    return NextResponse.json(dump);
  } catch (error) {
    console.error('Error updating dump:', error);
    return NextResponse.json(
      { error: 'Failed to update dump' },
      { status: 500 }
    );
  }
}
