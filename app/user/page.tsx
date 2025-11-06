"use client";
import { redirect } from "next/navigation";
import { useUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

export default function UserRedirect() {
	const { user, status } = useUser();
	if (status === "loading") {
		return null;
	}

	if (!user) {
		redirect("/login");
	}

	console.log(user);
	const name = user.tipo === "ADMIN" ? "Admin" : user?.client?.nome;

	return (
		<>
			<h1>Olá, {name}</h1>
			<button type="button" onClick={(_) => logoutAction("/")}>
				Logout
			</button>
		</>
	);
}
