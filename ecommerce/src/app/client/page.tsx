'use client';

import { WithAuth } from '@/components/auth/WithAuth';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';

function ClientDashboard() {
  const { user, client } = useUser();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard do Cliente</h1>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Sair
              </button>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-purple-800 mb-4">Bem-vindo, {client?.name}!</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-purple-700">Informações Pessoais</h3>
                  <dl className="mt-2 space-y-1">
                    <div>
                      <dt className="text-sm text-gray-600">Email:</dt>
                      <dd className="text-sm text-gray-900">{user?.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">CPF:</dt>
                      <dd className="text-sm text-gray-900">{client?.cpf}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">Cidade:</dt>
                      <dd className="text-sm text-gray-900">{client?.city}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="font-medium text-purple-700">Tipo de Conta</h3>
                  <p className="mt-2 text-sm text-gray-900">Cliente</p>
                  <p className="text-xs text-gray-500">Acesso às funcionalidades para clientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientDashboardPage() {
  return (
    <WithAuth requiredType="CLIENT">
      <ClientDashboard />
    </WithAuth>
  );
}