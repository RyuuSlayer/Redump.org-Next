import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT request received for dump ID:', params.id);

    const session = await auth();
    console.log('Session:', session);

    if (!session || session.user.role !== 'ADMIN') {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    console.log('Received form data:', Object.fromEntries(formData.entries()));

    const title = formData.get('title') as string;
    
    if (!title) {
      console.log('Title is missing');
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Parse tracks data
    let tracks = [];
    const tracksData = formData.get('tracks');
    if (tracksData) {
      try {
        tracks = JSON.parse(tracksData as string);
        console.log('Parsed tracks:', tracks);
      } catch (e) {
        console.error('Error parsing tracks:', e);
        tracks = [];
      }
    }

    // Parse languages
    let languages = [];
    const languagesData = formData.getAll('languages');
    if (languagesData.length > 0) {
      languages = languagesData.map(lang => lang.toString());
      console.log('Parsed languages:', languages);
    }

    // First, delete existing tracks
    console.log('Deleting existing tracks for dump:', params.id);
    await prisma.track.deleteMany({
      where: {
        dumpId: params.id,
      },
    });

    console.log('Updating dump with data:', {
      title,
      region: formData.get('region'),
      languages,
      status: formData.get('status'),
      tracks: tracks.length,
    });

    const dump = await prisma.dump.update({
      where: {
        id: params.id,
      },
      data: {
        title: title,
        region: formData.get('region') as string,
        languages: languages,
        status: parseInt(formData.get('status') as string),
        discNumber: formData.get('discNumber') as string,
        label: formData.get('label') as string,
        systemId: formData.get('systemId') as string,
        comments: formData.get('comments') as string,
        libCrypt: formData.get('libCrypt') === 'true',
        edc: formData.get('edc') === 'true',
        antiModchip: formData.get('antiModchip') === 'true',
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
          create: tracks.map((track: any) => ({
            number: parseInt(track.number),
            type: track.type,
            pregap: parseInt(track.pregap),
            size: BigInt(track.size),
            crc32: track.crc32,
            md5: track.md5,
            sha1: track.sha1,
            offset: parseInt(track.offset) || 0,
            sectors: parseInt(track.sectors) || 0,
          })),
        },
      },
      include: {
        tracks: true,
      },
    });

    console.log('Successfully updated dump:', dump.id);
    return NextResponse.json(dump);
  } catch (error) {
    console.error('Error updating dump:', error);
    return NextResponse.json(
      { error: 'Failed to update dump: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
