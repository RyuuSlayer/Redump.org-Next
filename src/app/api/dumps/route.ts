import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const dump = await prisma.dump.create({
      data: {
        title: title,
        region: formData.get('region') as string,
        languages: [formData.get('languages') as string],
        status: parseInt(formData.get('status') as string),
        discNumber: formData.get('discNumber') as string,
        label: formData.get('label') as string,
        systemId: formData.get('systemId') as string,
        comments: formData.get('comments') as string,
        libCrypt: formData.get('libCrypt') === 'true',
        edc: formData.get('edc') === 'true',
        antiModchip: formData.get('antiModchip') === 'true',
        submitterId: 'temp-user-id', // TODO: Get from auth session
        // New fields
        serialNumber: formData.get('serialNumber') as string,
        version: formData.get('version') as string,
        exeDate: formData.get('exeDate') ? new Date(formData.get('exeDate') as string) : null,
        publisher: formData.get('publisher') as string,
        developer: formData.get('developer') as string,
        barcode: formData.get('barcode') as string,
        category: parseInt(formData.get('category') as string) || 0,
        innerRingCode: formData.get('innerRingCode') as string,
        outerRingCode: formData.get('outerRingCode') as string,
        mouldSID: formData.get('mouldSID') as string,
        tracks: {
          create: JSON.parse(formData.get('tracks') as string || '[]').map((track: any) => ({
            number: track.number,
            type: track.type,
            pregap: track.pregap,
            size: track.size,
            crc32: track.crc32,
            md5: track.md5,
            sha1: track.sha1,
            offset: track.offset,
            sectors: track.sectors,
          })),
        },
      },
      include: {
        tracks: true,
      },
    });

    return NextResponse.json(dump);
  } catch (error) {
    console.error('Error creating dump:', error);
    return NextResponse.json(
      { error: 'Failed to create dump' },
      { status: 500 }
    );
  }
}
