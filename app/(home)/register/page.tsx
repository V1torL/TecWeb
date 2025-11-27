"use client";

import { useState } from "react";
import { registerUserAction } from "./actions";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Input } from "@/lib/components";

export default function Register() {
	const { pending } = useFormStatus();
	const [error, setError] = useState<string | undefined>();

	return (
		<main>
			<div className="box flex-col">
				<h2 className="title">Cadastro de Cliente</h2>
				<form
					className="flex-col"
					onSubmit={async (e) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						const error = await registerUserAction(
							Object.fromEntries(formData),
						);
						setError(error?.error);
					}}
				>
					<Input name="email" type="email" placeholder="Email" required />
					<Input name="senha" type="password" placeholder="Senha" required />
					<Input name="cpf" type="text" placeholder="CPF" required />
					<Input name="nome" type="text" placeholder="Nome" required />
					<Input name="telefone" type="text" placeholder="Telefone" required />
					<Input name="endereco" type="text" placeholder="Endereço" required />
					<Input name="cidade" type="text" placeholder="Cidade" required />
					<button type="submit" disabled={pending}>
						Cadastrar
					</button>
				</form>
				{!error ? null : <p>Erro: {error}</p>}
				<p className="tip">
					Já possui conta? <Link href="/login">Faça login</Link>
				</p>
			</div>
		</main>
	);
}
