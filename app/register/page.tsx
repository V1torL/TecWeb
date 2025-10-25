"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
`;

const Box = styled.div`
  background: #fff;
  padding: 40px 50px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  margin-bottom: 25px;
  color: #222;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const Text = styled.p`
  text-align: center;
  margin-top: 15px;
  color: #555;
`;

const Link = styled.a`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Register() {
	const [form, setForm] = useState({
		email: "",
		senha: "",
		cpf: "",
		nome: "",
		telefone: "",
		endereco: "",
		cidade: "",
	});

	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});

		const data = await res.json();

		if (res.ok) {
			alert("Cadastro realizado! Faça login.");
			router.push("/login");
		} else {
			alert(data.error);
		}
	};

	return (
		<Container>
			<Box>
				<Title>Cadastro de Cliente</Title>
				<Form onSubmit={handleSubmit}>
					<Input
						type="email"
						placeholder="Email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						required
					/>
					<Input
						type="password"
						placeholder="Senha"
						value={form.senha}
						onChange={(e) => setForm({ ...form, senha: e.target.value })}
						required
					/>
					<Input
						type="text"
						placeholder="CPF"
						value={form.cpf}
						onChange={(e) => setForm({ ...form, cpf: e.target.value })}
						required
					/>
					<Input
						type="text"
						placeholder="Nome"
						value={form.nome}
						onChange={(e) => setForm({ ...form, nome: e.target.value })}
						required
					/>
					<Input
						type="text"
						placeholder="Telefone"
						value={form.telefone}
						onChange={(e) => setForm({ ...form, telefone: e.target.value })}
						required
					/>
					<Input
						type="text"
						placeholder="Endereço"
						value={form.endereco}
						onChange={(e) => setForm({ ...form, endereco: e.target.value })}
						required
					/>
					<Input
						type="text"
						placeholder="Cidade"
						value={form.cidade}
						onChange={(e) => setForm({ ...form, cidade: e.target.value })}
						required
					/>
					<Button type="submit">Cadastrar</Button>
				</Form>
				<Text>
					Já possui conta? <Link href="/login">Faça login</Link>
				</Text>
			</Box>
		</Container>
	);
}
