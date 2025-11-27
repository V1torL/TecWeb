"use client";
import { useState } from "react";
import { loginAction } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { Input } from "@/lib/components";
import Link from "next/link";

export default function Login() {
	const { pending } = useFormStatus();
	const [error, setError] = useState<string | null>(null);

	return (
		<main>
			<div className="box flex-col">
				<h1 className="title">Login</h1>
				<form
					className="flex-col"
					action={async (e) => {
						const res = await loginAction(Object.fromEntries(e));
						if (res?.error) setError(res.error);
					}}
				>
					<Input type="email" name="email" placeholder="Email" required />
					<Input name="password" type="password" placeholder="Senha" required />
					{!error ? null : <p>{error}</p>}
					<button type="submit" disabled={pending}>
						{pending ? "Entrando..." : "Entrar"}
					</button>
				</form>
				<p className="tip">
					Não tem conta? <Link href="/register">Cadastre-se</Link>
				</p>
			</div>
		</main>
	);
}
