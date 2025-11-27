"use server";
import { loginAction } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as z from "zod";

const CreateUserSchema = z.object({
	email: z.email(),
	senha: z.string(),
	cpf: z.string(),
	nome: z.string(),
	telefone: z.string(),
	endereco: z.string(),
	cidade: z.string(),
});

export async function registerUserAction(
	body: object,
): Promise<{ error: string } | undefined> {
	try {
		const userData = await CreateUserSchema.parseAsync(body);
		const userExists = await prisma.user.findUnique({
			where: { email: userData.email },
		});
		if (userExists) {
			return { error: "Email já cadastrado" };
		}
		const clientExists = await prisma.client.findUnique({
			where: { cpf: userData.cpf },
		});
		if (clientExists) {
			return { error: "CPF já cadastrado" };
		}
		const user = await prisma.user.create({
			data: {
				email: userData.email,
				senha: userData.senha,
				tipo: "CLIENT",
				client: {
					create: {
						cpf: userData.cpf,
						nome: userData.nome,
						telefone: userData.telefone,
						endereco: userData.endereco,
						cidade: userData.cidade,
					},
				},
			},
			include: {
				client: true,
			},
		});
		await loginAction({ email: userData.email, password: userData.senha });
	} catch (e) {
		if (e instanceof z.ZodError) {
			return { error: "Dados inválidos" };
		}
		throw e;
	}
}
