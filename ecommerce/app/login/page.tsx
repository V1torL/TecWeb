'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
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
      alert(data.error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Entrar
        </button>
      </form>
      <p className="mt-4">
        Não tem conta? <a href="/register" className="text-blue-500">Cadastre-se</a>
      </p>
    </div>
  )
}