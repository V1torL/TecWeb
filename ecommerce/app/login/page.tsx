'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import Header from '@/components/Header'

const Container = styled.div`
  min-height: 100vh;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
`

const Box = styled.div`
  background: #fff;
  padding: 40px 50px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  width: 400px;
`

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  margin-bottom: 25px;
  color: #222;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`

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
`

const Text = styled.p`
  text-align: center;
  margin-top: 15px;
  color: #555;
`

const Link = styled.a`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    senha: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))

        if (data.user.tipo === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/client')
        }
      } else {
        alert(data.error || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      alert('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <>
      <Header />
      <Container>
        <Box>
          <Title>Login</Title>
          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange('email')}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange('senha')}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>
          <Text>
            Não tem conta? <Link href="/register">Cadastre-se</Link>
          </Text>
        </Box>
      </Container>
    </>
  )
}