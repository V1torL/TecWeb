"use client";
import { useState } from "react";
import styled from "styled-components";
import { signIn } from "@/lib/auth";
import { ClientLoginAction } from "@/lib/actions";
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
  background-color: #0070f3;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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

export default function Login() {
	"use client";
	const { pending } = useFormStatus();
	const [error, setError] = useState<string | null>(null);

	return (
		<Container>
			<Box>
				<Title>Login</Title>
				<Form
					action={async (e) => {
						const err = await ClientLoginAction(e);
						console.log(err);
						setError(err.error);
					}}
				>
					<Input
						defaultValue="email@email.com"
						type="email"
						name="email"
						placeholder="Email"
						required
					/>
					<Input
						defaultValue="123"
						name="password"
						type="password"
						placeholder="Senha"
						required
					/>
					{!error ? null : <p>{error}</p>}
					<Button disabled={pending}>
						{pending ? "Entrando..." : "Entrar"}
					</Button>
				</Form>
				<Text>
					Não tem conta? <Link href="/register">Cadastre-se</Link>
				</Text>
			</Box>
		</Container>
	);
}
