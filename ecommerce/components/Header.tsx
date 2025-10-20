'use client'

import Link from 'next/link'

export default function Header() {

  const categorias = [
    'Eletrônicos',
    'Roupas',
    'Casa',
    'Esportes',
    'Beleza',
    'Livros',
    'Brinquedos',
    'Automotivo'
  ]

  return (
    <header className="w-full">
      <div className="bg-black text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center hover:text-gray-300">
            Home
          </Link>
          <div className="flex space-x-4">
            <Link 
              href="/login" 
              className="hover:text-gray-300 transition-colors"
            >
              Entrar
            </Link>
            <Link 
              href="/register" 
              className="hover:text-gray-300 transition-colors"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white border-b py-3 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8 overflow-x-auto">
            {categorias.map((categoria, index) => (
              <Link
                key={index}
                href={`/categoria/${categoria.toLowerCase()}`}
                className="whitespace-nowrap text-gray-700 hover:text-black font-medium transition-colors"
              >
                {categoria}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}