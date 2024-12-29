import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      role: 'ADMIN',
    },
  })

  // Create systems
  const ps1 = await prisma.system.upsert({
    where: { shortName: 'PS1' },
    update: {},
    create: {
      name: 'Sony PlayStation',
      shortName: 'PS1',
      description: 'Fifth-generation home video game console',
    },
  })

  const ps2 = await prisma.system.upsert({
    where: { shortName: 'PS2' },
    update: {},
    create: {
      name: 'Sony PlayStation 2',
      shortName: 'PS2',
      description: 'Sixth-generation home video game console',
    },
  })

  const dc = await prisma.system.upsert({
    where: { shortName: 'DC' },
    update: {},
    create: {
      name: 'Sega Dreamcast',
      shortName: 'DC',
      description: 'Sixth-generation home video game console',
    },
  })

  // Create sample dumps
  await prisma.dump.upsert({
    where: { id: 'ff7-eur' },
    update: {},
    create: {
      id: 'ff7-eur',
      title: 'Final Fantasy VII',
      region: 'EUR',
      languages: ['English', 'French', 'German'],
      status: 1,
      discNumber: '1',
      label: 'SCES-00867',
      system: { connect: { id: ps1.id } },
      submitter: { connect: { id: admin.id } },
      comments: 'Black label release',
      libCrypt: true,
      edc: true,
      antiModchip: false,
      serialNumber: 'SCES-00867',
      version: '2.0',
      exeDate: new Date('1997-09-01'),
      publisher: 'Sony Computer Entertainment Europe',
      developer: 'Square',
      barcode: '711719408123',
      category: 0,
      innerRingCode: 'SCES-00867-P1',
      outerRingCode: 'SCES-00867-P2',
      mouldSID: 'Sony DADC A1',
      tracks: {
        create: [
          {
            number: 1,
            type: 4,
            pregap: 150,
            size: BigInt('681984000'),
            crc32: 'A1B2C3D4',
            md5: 'deadbeef123456789abcdef0123456789',
            sha1: 'deadbeef123456789abcdef0123456789abcdef01',
          },
          {
            number: 2,
            type: 1,
            pregap: 150,
            size: BigInt('52428800'),
          },
        ],
      },
    },
  })

  await prisma.dump.upsert({
    where: { id: 'mgs-usa' },
    update: {},
    create: {
      id: 'mgs-usa',
      title: 'Metal Gear Solid',
      region: 'USA',
      languages: ['English'],
      status: 1,
      discNumber: '1',
      label: 'SLUS-00594',
      system: { connect: { id: ps1.id } },
      submitter: { connect: { id: admin.id } },
      comments: 'Greatest Hits release',
      libCrypt: false,
      edc: true,
      antiModchip: false,
      serialNumber: 'SLUS-00594',
      version: '1.1',
      exeDate: new Date('1998-10-21'),
      publisher: 'Konami',
      developer: 'Konami Computer Entertainment Japan',
      barcode: '083717150022',
      category: 0,
      innerRingCode: 'SLUS-00594-P1',
      outerRingCode: 'SLUS-00594-P2',
      mouldSID: 'Sony DADC A2',
      tracks: {
        create: [
          {
            number: 1,
            type: 4,
            pregap: 150,
            size: BigInt('681984000'),
            crc32: 'B1C2D3E4',
            md5: 'abcdef0123456789deadbeef01234567',
            sha1: 'abcdef0123456789deadbeef0123456789abcdef01',
          },
        ],
      },
    },
  })

  await prisma.dump.upsert({
    where: { id: 'shenmue-jpn' },
    update: {},
    create: {
      id: 'shenmue-jpn',
      title: 'Shenmue',
      region: 'JPN',
      languages: ['Japanese'],
      status: 1,
      discNumber: '1',
      label: 'HDR-0016',
      system: { connect: { id: dc.id } },
      submitter: { connect: { id: admin.id } },
      comments: 'First print',
      libCrypt: false,
      edc: false,
      antiModchip: false,
      serialNumber: 'HDR-0016',
      version: '1.0',
      exeDate: new Date('1999-12-29'),
      publisher: 'Sega',
      developer: 'Sega AM2',
      barcode: '4974365090166',
      category: 0,
      innerRingCode: 'HDR-0016-P1',
      outerRingCode: 'HDR-0016-P2',
      mouldSID: 'Sega GD-ROM1',
      tracks: {
        create: [
          {
            number: 1,
            type: 4,
            pregap: 150,
            size: BigInt('1073741824'),
            crc32: 'C1D2E3F4',
            md5: '123456789abcdef0deadbeef01234567',
            sha1: '123456789abcdef0deadbeef0123456789abcdef01',
          },
        ],
      },
    },
  })

  await prisma.dump.upsert({
    where: { id: 'gt3-eur' },
    update: {},
    create: {
      id: 'gt3-eur',
      title: 'Gran Turismo 3: A-Spec',
      region: 'EUR',
      languages: ['English', 'French', 'German', 'Italian', 'Spanish'],
      status: 1,
      discNumber: '1',
      label: 'SCES-50294',
      system: { connect: { id: ps2.id } },
      submitter: { connect: { id: admin.id } },
      comments: 'Platinum release',
      libCrypt: false,
      edc: true,
      antiModchip: true,
      serialNumber: 'SCES-50294',
      version: '2.01',
      exeDate: new Date('2001-07-20'),
      publisher: 'Sony Computer Entertainment Europe',
      developer: 'Polyphony Digital',
      barcode: '711719250029',
      category: 0,
      innerRingCode: 'SCES-50294-P1',
      outerRingCode: 'SCES-50294-P2',
      mouldSID: 'Sony DADC B1',
      tracks: {
        create: [
          {
            number: 1,
            type: 4,
            pregap: 150,
            size: BigInt('4700000000'),
            crc32: 'D1E2F3G4',
            md5: '123456789abcdef0deadbeef01234567',
            sha1: '123456789abcdef0deadbeef0123456789abcdef01',
          },
        ],
      },
    },
  })

  console.log('Database has been seeded with sample data.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
