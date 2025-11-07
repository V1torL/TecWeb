"use server";

import assert from "node:assert";
import prisma from "./prisma";
import { signIn, signOut } from "./auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
export async function authenticateAction({
	email,
	password,
}: Partial<Record<"email" | "password", unknown>>) {
	assert(typeof email === "string");
	assert(typeof password === "string");
	const user = await prisma.user.findUnique({
		where: { email: email, senha: password },
		include: {
			client: true,
			admin: true,
		},
	});
	return user;
}

export async function loginAction(
	loginData: object,
): Promise<{ error: string; detail: any }> {
	try {
		await signIn("credentials", {
			redirect: true,
			redirectTo: "/user",
			...loginData,
		});
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
