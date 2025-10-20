import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        client: true,
        admin: true
      }
    })

    if (!user || user.senha !== senha) {
      return NextResponse.json({ error: 'Email ou senha inválidos' }, { status: 401 })
    }

    return NextResponse.json({
      message: 'Login realizado',
      user: {
        id: user.id,
        email: user.email,
        tipo: user.tipo,
        client: user.client,
        admin: user.admin
      }
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}