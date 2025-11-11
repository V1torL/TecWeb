"use client";
import { useState } from "react";
import styled from "styled-components";
import { loginAction } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { Form, Button, Input } from "@/lib/elements";

const Container = styled.div`
  min-height: 100vh;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
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
						const res = await loginAction(Object.fromEntries(e));
						if (res?.error) setError(res.error);
					}}
				>
					<Input type="email" name="email" placeholder="Email" required />
					<Input name="password" type="password" placeholder="Senha" required />
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
