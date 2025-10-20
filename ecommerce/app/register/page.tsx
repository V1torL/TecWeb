'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    senha: '',
    cpf: '',
    nome: '',
    telefone: '',
    endereco: '',
    cidade: ''
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    
    const data = await res.json()
    
    if (res.ok) {
      alert('Cadastro realizado! Faça login.')
      router.push('/login')
    } else {
      alert(data.error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Cliente</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={(e) => setForm({...form, senha: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="CPF"
          value={form.cpf}
          onChange={(e) => setForm({...form, cpf: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({...form, nome: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Telefone"
          value={form.telefone}
          onChange={(e) => setForm({...form, telefone: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Endereço"
          value={form.endereco}
          onChange={(e) => setForm({...form, endereco: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Cidade"
          value={form.cidade}
          onChange={(e) => setForm({...form, cidade: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          Cadastrar
        </button>
      </form>
    </div>
  )
}