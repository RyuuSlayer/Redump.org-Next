import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json()
    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    return NextResponse.json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
