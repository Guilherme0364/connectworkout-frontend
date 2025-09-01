import { useAuthContext, AuthContextType } from '../contexts/AuthContext';

export const useAuth = (): AuthContextType => {
  return useAuthContext();
};

export default useAuth;