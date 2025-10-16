import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Sistema de Autenticação
        </h1>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 block text-center"
          >
            Fazer Login
          </Link>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/register"
              className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200 text-center"
            >
              Cadastre
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}