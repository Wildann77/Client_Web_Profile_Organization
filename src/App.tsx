import { Routes, Route } from 'react-router-dom';
import { useAuth } from './features/auth/hooks/useAuth';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ArticlesPage } from './pages/public/ArticlesPage';
import { ArticleDetailPage } from './pages/public/ArticleDetailPage';

// Admin Pages
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { AdminArticlesPage } from './pages/admin/AdminArticlesPage';
import { CreateArticlePage } from './pages/admin/CreateArticlePage';
import { EditArticlePage } from './pages/admin/EditArticlePage';

// Components
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/artikel" element={<ArticlesPage />} />
      <Route path="/artikel/:slug" element={<ArticleDetailPage />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/artikel"
        element={
          <ProtectedRoute>
            <AdminArticlesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/artikel/baru"
        element={
          <ProtectedRoute requiredRole="EDITOR">
            <CreateArticlePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/artikel/:id/edit"
        element={
          <ProtectedRoute requiredRole="EDITOR">
            <EditArticlePage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-muted-foreground">Halaman tidak ditemukan</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
