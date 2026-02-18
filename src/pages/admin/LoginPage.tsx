import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useEffect } from 'react';
import { useSetting } from '@/features/settings/hooks/useSettings';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const siteName = useSetting('site_name');
  const siteLogo = useSetting('site_logo');

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-foreground">
      <div className="mb-8 text-center">
        <div className="flex flex-col items-center gap-4 mb-4">
          {siteLogo ? (
            <img src={siteLogo} alt={siteName || 'Logo'} className="h-16 w-16 object-contain" />
          ) : (
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-2xl">{siteName?.charAt(0) || 'A'}</span>
            </div>
          )}
          <h1 className="font-bold text-2xl">{siteName || 'Admin Panel'}</h1>
        </div>
        <p className="text-muted-foreground italic">
          Login ke Panel Kontrol
        </p>
      </div>

      <LoginForm onSuccess={handleSuccess} />

    </div>
  );
};
