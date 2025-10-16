import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

async function main() {
  console.log('🌱 Iniciando seed...')

  try {
    await prisma.client.deleteMany()
    await prisma.admin.deleteMany()
    await prisma.user.deleteMany()

    const adminPassword = await hashPassword('admin123')
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: adminPassword,
        type: 'ADMIN',
        admin: {
          create: {}
        }
      }
    })
    console.log('✅ Admin criado: admin@example.com / admin123')

    const clientPassword = await hashPassword('cliente123')
    await prisma.user.create({
      data: {
        email: 'cliente@example.com',
        password: clientPassword,
        type: 'CLIENT',
        client: {
          create: {
            cpf: '123.456.789-00',
            name: 'João Silva',
            city: 'São Paulo'
          }
        }
      }
    })
    console.log('✅ Cliente criado: cliente@example.com / cliente123')

    console.log('🎉 Seed completed!')
  } catch (error) {
    console.error('❌ Erro no seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })