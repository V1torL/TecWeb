import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const userExists = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (userExists) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        senha: body.senha,
        tipo: 'CLIENT',
        client: {
          create: {
            cpf: body.cpf,
            nome: body.nome,
            telefone: body.telefone,
            endereco: body.endereco,
            cidade: body.cidade
          }
        }
      },
      include: {
        client: true
      }
    })

    return NextResponse.json({ 
      message: 'Cliente cadastrado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        tipo: user.tipo
      }
    })

  } catch (error) {
    console.error('Erro no cadastro:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}