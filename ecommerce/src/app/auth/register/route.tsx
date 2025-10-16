import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, cpf, name, city } = await request.json();

    if (!email || !password || !cpf || !name || !city) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    const existingClient = await prisma.client.findUnique({
      where: { cpf }
    });

    if (existingClient) {
      return NextResponse.json(
        { error: 'CPF já cadastrado' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        type: 'CLIENT',
        client: {
          create: {
            cpf,
            name,
            city
          }
        }
      },
      include: {
        client: true
      }
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      type: user.type,
      clientId: user.client?.id
    });

    return NextResponse.json({
      message: 'Cliente criado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        type: user.type,
        client: user.client
      },
      token
    });
  } catch (error) {
    console.error('Erro no registro cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}