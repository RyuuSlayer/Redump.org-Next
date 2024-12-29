import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.post.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.ringCode.deleteMany()
  await prisma.track.deleteMany()
  await prisma.dump.deleteMany()
  await prisma.system.deleteMany()
  await prisma.user.deleteMany()

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      role: 'ADMIN',
    },
  })

  // Create systems
  const ps1 = await prisma.system.create({
    data: {
      name: 'Sony PlayStation',
      shortName: 'PS1',
      description: 'Fifth-generation home video game console',
    },
  })

  const ps2 = await prisma.system.create({
    data: {
      name: 'Sony PlayStation 2',
      shortName: 'PS2',
      description: 'Sixth-generation home video game console',
    },
  })

  const dreamcast = await prisma.system.create({
    data: {
      name: 'Sega Dreamcast',
      shortName: 'DC',
      description: 'Sixth-generation home video game console',
    },
  })

  // Create dumps
  await prisma.dump.create({
    data: {
      title: 'Final Fantasy VII',
      region: 'NTSC-U',
      languages: ['English'],
      systemId: ps1.id,
      dateAdded: new Date('2023-12-28'),
      isNew: true,
      discNumber: '1',
      label: 'Greatest Hits',
      status: 2, // Verified
      comments: 'Perfect dump',
      submitterId: user.id,
      libCrypt: false,
      edc: true,
      antiModchip: false,
      tracks: {
        create: [
          {
            number: 1,
            type: 4, // Data
            size: 681984000,
            crc32: 'A1B2C3D4',
            md5: '123456789abcdef0123456789abcdef0',
            sha1: '123456789abcdef0123456789abcdef012345678',
            sectors: 333333,
          },
        ],
      },
      ringCode: {
        create: {
          type: 'SID',
          value: 'SCES-12345',
        },
      },
    },
  })

  await prisma.dump.create({
    data: {
      title: 'Metal Gear Solid 2: Sons of Liberty',
      region: 'PAL',
      languages: ['English', 'French', 'German'],
      systemId: ps2.id,
      dateAdded: new Date('2023-12-27'),
      isNew: true,
      status: 2, // Verified
      comments: 'Includes bonus disc',
      submitterId: user.id,
      libCrypt: true,
      edc: true,
      antiModchip: true,
      tracks: {
        create: [
          {
            number: 1,
            type: 4, // Data
            size: 4699979776,
            crc32: 'E5F6G7H8',
            md5: 'abcdef0123456789abcdef0123456789',
            sha1: '9abcdef0123456789abcdef0123456789abcdef01',
            sectors: 2291666,
          },
        ],
      },
      ringCode: {
        create: {
          type: 'SID',
          value: 'SLES-67890',
        },
      },
    },
  })

  await prisma.dump.create({
    data: {
      title: 'Shenmue',
      region: 'NTSC-J',
      languages: ['Japanese'],
      systemId: dreamcast.id,
      dateAdded: new Date('2023-12-26'),
      isNew: true,
      discNumber: '1',
      status: 2, // Verified
      comments: 'First print',
      submitterId: user.id,
      libCrypt: false,
      edc: true,
      antiModchip: false,
      tracks: {
        create: [
          {
            number: 1,
            type: 4, // Data
            size: 1459978240,
            crc32: 'I9J0K1L2',
            md5: '23456789abcdef0123456789abcdef01',
            sha1: 'bcdef0123456789abcdef0123456789abcdef012',
            sectors: 711666,
          },
        ],
      },
      ringCode: {
        create: {
          type: 'MID',
          value: 'HDR-0118',
        },
      },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
