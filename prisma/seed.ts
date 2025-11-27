import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
	{
		name: "Chiclete",
		description: "Chiclete sabor tutti-frutti",
		price: 1.5,
		stock: 100,
	},
	{ name: "Bala", description: "Bala sortida", price: 0.25, stock: 500 },
	{
		name: "Refrigerante",
		description: "Refrigerante lata 350ml",
		price: 6.0,
		stock: 50,
	},
	{ name: "Biscoito", description: "Biscoito recheado", price: 3.5, stock: 80 },
];

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

	await prisma.product.createMany({
		data: PRODUCTS,
	});
}

main()
	.catch((e) => {
		console.error("❌ Erro ao executar seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
