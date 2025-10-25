import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: { tipo: 'ADMIN' }
  })

  if (!existingAdmin) {
    
    await prisma.user.create({
      data: {
        email: 'admin@ecommerce.com',
        senha: 'admin123',
        tipo: 'ADMIN',
        admin: { create: {} }
      }
    })
    
    console.log('✅ Admin pré-cadastrado criado:')
    console.log('📧 Email: admin@ecommerce.com')
    console.log('🔑 Senha: admin123')
  } else {
    console.log('ℹ️ Admin já existe no banco de dados')
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