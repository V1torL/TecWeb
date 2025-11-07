"use server";

// !IMPORTANT: Deve ser um server component, senão
// aquele bug de voltar pro login se repete.

import { redirect } from "next/navigation";
import { logoutAction } from "@/lib/actions";
import { getUser } from "@/lib/auth";

export default async function UserRedirect() {
	const user = await getUser();
	if (!user) {
		redirect("/login");
	}

	const name = user.tipo === "ADMIN" ? "Admin" : user?.client?.nome;

	return (
		<>
			<h1>Olá, {name}</h1>
			<form action={logoutAction}>
				<button type="submit">Logout</button>
			</form>
		</>
	);
}
