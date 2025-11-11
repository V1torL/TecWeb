"use server";

import prisma from "./prisma";
import { signIn, signOut } from "./auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function authenticateAction({
	email,
	password,
}: Partial<Record<"email" | "password", unknown>>) {
	if (typeof email !== "string" || typeof password !== "string") {
		throw new Error("Email e senha são obrigatórios");
	}

	const user = await prisma.user.findUnique({
		where: { email, senha: password },
		include: {
			client: true,
			admin: true,
		},
	});

	return user;
}

export async function loginAction(
	loginData: Record<string, FormDataEntryValue>,
): Promise<{ error?: string; detail?: unknown } | void> {
	try {
		const email = String(loginData.email);
		const password = String(loginData.password);

		if (!email || !password) {
			return { error: "Email e senha são obrigatórios" };
		}

		const user = await prisma.user.findUnique({
			where: { email, senha: password },
			include: {
				client: true,
				admin: true,
			},
		});

		if (!user) {
			return { error: "Credenciais inválidas" };
		}

		await signIn("credentials", {
			redirect: false,
			...loginData,
		});

		if (user.tipo === "ADMIN") {
			redirect("/dashboard");
		} else {
			redirect("/home");
		}
	} catch (e) {
		if (e instanceof AuthError) {
			return { error: "Credenciais Inválidas", detail: e };
		}
		throw e;
	}
}

export async function logoutAction(): Promise<never> {
	return await signOut({
		redirectTo: "/login",
	});
}
