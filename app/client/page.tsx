"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientLogoutAction } from "@/lib/actions";

export default function ClientPage() {
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (!userData) {
			router.push("/login");
			return;
		}

		const userObj = JSON.parse(userData);
		setUser(userObj);

		if (userObj.tipo !== "CLIENT") {
			router.push("/admin");
		}
	}, [router]);

	if (!user) return <div>Carregando...</div>;

	return (
		<div>
			<h1>Área do Cliente</h1>
			<p>Bem-vindo, Cliente!</p>
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
