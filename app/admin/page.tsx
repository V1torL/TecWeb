"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
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

		if (userObj.tipo !== "ADMIN") {
			router.push("/client");
		}
	}, [router]);

	if (!user) return <div>Carregando...</div>;

	return (
		<div>
			<h1>Painel Admin</h1>
			<p>Bem-vindo, Admin!</p>
			<button
				onClick={() => {
					localStorage.removeItem("user");
					router.push("/login");
				}}
			>
				Sair
			</button>
		</div>
	);
}
