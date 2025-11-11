"use client";

import { logoutAction } from "@/lib/actions";

export default function AdminPage() {
	return (
		<div style={{ padding: "50px", textAlign: "center" }}>
			<h1>Bem-vindo, Cliente!</h1>
			<p>Esta é a área do cliente.</p>

			<form action={logoutAction} style={{ marginTop: "20px" }}>
				<button type="submit" style={{ padding: "10px 20px" }}>
					Logout
				</button>
			</form>
		</div>
	);
}
