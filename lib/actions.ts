"use server";

import assert from "node:assert";
import prisma from "./prisma";
import { signIn, signOut } from "./auth";
import { AuthError } from "next-auth";

export async function ServerLogInAction({
	email,
	password,
}: Partial<Record<"email" | "password", unknown>>) {
	assert(typeof email === "string");
	assert(typeof password === "string");
	const user = await prisma.user.findUnique({
		where: { email: email, senha: password },
	});
	console.log("aaaaaaaaaaaaaa", user);
	return user;
}

export async function ClientLoginAction(
	formData: FormData,
): Promise<{ error: string; detail: any }> {
	try {
		await signIn("credentials", {
			redirectTo: "/user",
			...Object.fromEntries(formData),
		});
	} catch (e) {
		if (e instanceof AuthError) {
			return { error: "Invalid credentials", detail: e };
		}
		throw e;
	}
	throw "Unreachable";
}

export async function ClientLogoutAction(
	redirect: string,
): Promise<never> {
		return await signOut({
			redirectTo: redirect,
		});
}
