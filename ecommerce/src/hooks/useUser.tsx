import { useAuth } from './useAuth';

export function useUser() {
  const { user } = useAuth();
  
  const isAdmin = user?.type === 'ADMIN';
  const isClient = user?.type === 'CLIENT';
  
  return {
    user,
    isAdmin,
    isClient,
    client: user?.client,
    admin: user?.admin
  };
}