"use client";

import { FormEvent, useState } from "react";
import styled from "styled-components";
import { registerUserAction } from "./actions";
import { useFormStatus } from "react-dom";

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
	const { pending } = useFormStatus();
	const [error, setError] = useState<string | undefined>();

	return (
		<Container>
			<Box>
				<Title>Cadastro de Cliente</Title>
				<Form
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
					<Button type="submit" disabled={pending}>
						Cadastrar
					</Button>
				</Form>
				{!error ? null : <Text>Erro: {error}</Text>}
				<Text>
					Já possui conta? <Link href="/login">Faça login</Link>
				</Text>
			</Box>
		</Container>
	);
}
