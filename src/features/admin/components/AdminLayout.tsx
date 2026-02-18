import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { ModeToggle } from '@/components/ModeToggle';
import { useSetting } from '@/features/settings/hooks/useSettings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/artikel', label: 'Artikel', icon: FileText },
  { path: '/admin/pengguna', label: 'Pengguna', icon: Users },
  { path: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const siteLogo = useSetting('site_logo');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // If we cross the 1024 breakpoint
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        // Only set to false if it was previously open or on initial load
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex text-foreground relative overflow-x-hidden">
      {/* Sidebar Backdrop (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300 lg:static',
          isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-20',
          !isSidebarOpen && 'invisible lg:visible'
        )}
      >
        <div className={cn(
          "h-full flex flex-col transition-opacity duration-200",
          !isSidebarOpen && "lg:w-20",
          !isSidebarOpen && "opacity-0 lg:opacity-100"
        )}>
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <Link
              to="/admin"
              className={cn(
                'flex items-center gap-2 font-bold text-lg text-primary transition-opacity',
                !isSidebarOpen && 'lg:opacity-0'
              )}
            >
              {siteLogo && (
                <img src={siteLogo} alt="Logo" className="h-8 w-8 object-contain" />
              )}
              <span className={cn(!isSidebarOpen && 'lg:hidden')}>Admin Panel</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-accent text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    !isSidebarOpen && 'lg:justify-center'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={cn(!isSidebarOpen && 'lg:hidden')}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  'flex items-center gap-3 w-full p-2 rounded-md hover:bg-accent transition-colors',
                  !isSidebarOpen && 'lg:justify-center'
                )}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={user?.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                  <div className={cn('text-left flex-1', !isSidebarOpen && 'lg:hidden')}>
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
                  </div>
                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground', !isSidebarOpen && 'lg:hidden')} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-accent text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <Link to="/" target="_blank">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Lihat Website
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
