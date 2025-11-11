import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Iniciando seed...");

	const adminUser = await prisma.user.upsert({
		where: { email: "admin@email.com" },
		update: {},
		create: {
			email: "admin@email.com",
			senha: "admin123",
			tipo: "ADMIN",
			admin: {
				create: {},
			},
		},
	});
	console.log("✅ Admin criado:", adminUser.email);

	const clientUser = await prisma.user.upsert({
		where: { email: "cliente@email.com" },
		update: {},
		create: {
			email: "cliente@email.com",
			senha: "cliente123",
			tipo: "CLIENT",
			client: {
				create: {
					cpf: "12345678900",
					nome: "João da Silva",
					telefone: "(11) 99999-9999",
					endereco: "Rua das Flores, 123",
					cidade: "São Paulo",
				},
			},
		},
		include: {
			client: true,
		},
	});
	console.log("✅ Cliente criado:", clientUser.email);

	console.log("🌱 Seed finalizado com sucesso!");
}

main()
	.catch((e) => {
		console.error("❌ Erro ao executar seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
