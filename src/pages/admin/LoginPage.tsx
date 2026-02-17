import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useEffect } from 'react';
import { Newspaper } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSuccess = () => {
    const from = (location.state as any)?.from?.pathname || '/admin';
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Newspaper className="h-10 w-10 text-primary" />
        <span className="font-bold text-2xl">Admin Panel</span>
        </div>
        <p className="text-muted-foreground">
          Web Profil Organisasi
        </p>
      </div>

      <LoginForm onSuccess={handleSuccess} />

      <p className="mt-8 text-sm text-muted-foreground text-center">
        Default login:<br />
        Email: admin@organisasi.com<br />
        Password: admin123
      </p>
    </div>
  );
};
