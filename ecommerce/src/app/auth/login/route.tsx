import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  type TokenPayload = {
    userId: string;
    email: string;
    type: 'ADMIN' | 'CLIENT';
    adminId?: string;
    clientId?: string;
  };
  
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        admin: true,
        client: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      type: user.type,
    };

    if (user.type === 'ADMIN' && user.admin) {
      tokenPayload.adminId = user.admin.id;
    } else if (user.type === 'CLIENT' && user.client) {
      tokenPayload.clientId = user.client.id;
    }

    const token = generateToken(tokenPayload);

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        type: user.type,
        admin: user.admin,
        client: user.client
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}