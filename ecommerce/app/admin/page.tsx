'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    const userObj = JSON.parse(userData)
    setUser(userObj)
    
    if (userObj.tipo !== 'ADMIN') {
      router.push('/client')
    }
  }, [router])

  if (!user) return <div>Carregando...</div>

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">Painel Admin</h1>
      <p>Bem-vindo, Admin!</p>
      <button 
        onClick={() => {
          localStorage.removeItem('user')
          router.push('/login')
        }}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Sair
      </button>
    </div>
  )
}