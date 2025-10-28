"use client";

import { redirect } from "next/navigation";
import { ClientLogoutAction } from "@/lib/actions";
import { useUser } from "@/lib/auth";

export default function AdminPage() {
	const userData = useUser();

	if (!userData) {
		redirect("/login");
	}

	if (userData.tipo !== "ADMIN") {
		redirect("/client");
		return;
	}

	return (
		<div>
			<h1>Painel Admin</h1>
			<p>Bem-vindo, Admin!</p>
			<button
				onClick={async () => {
					await ClientLogoutAction('/login')
				}}
			>
				Sair
			</button>
		</div>
	);
}
