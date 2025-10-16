'use client';

import { WithAuth } from '@/components/auth/WithAuth';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';

function AdminDashboard() {
  const { user } = useUser();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Sair
              </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">
                Bem-vindo, Administrador {user?.email}!
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <WithAuth requiredType="ADMIN">
      <AdminDashboard />
    </WithAuth>
  );
}