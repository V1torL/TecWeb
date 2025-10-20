import Header from '../components/Header'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Ecommerce
          </h1>
          <p className="text-lg text-gray-600">
            Encontre os melhores produtos nas nossas categorias
          </p>
        </div>
      </main>
    </div>
  )
}