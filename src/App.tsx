import { Routes, Route } from 'react-router-dom';
import { useAuth } from './features/auth/hooks/useAuth';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ArticlesPage } from './pages/public/ArticlesPage';
import { ArticleDetailPage } from './pages/public/ArticleDetailPage';
import { VisionMissionPage } from './pages/public/profile/VisionMissionPage';
import { HistoryPage } from './pages/public/profile/HistoryPage';
import { StructurePage } from './pages/public/profile/StructurePage';
import { LocationPage } from './pages/public/profile/LocationPage';

// Admin Pages
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { AdminArticlesPage } from './pages/admin/AdminArticlesPage';
import { CreateArticlePage } from './pages/admin/CreateArticlePage';
import { EditArticlePage } from './pages/admin/EditArticlePage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

// Components
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';
import { DynamicMetadata } from './components/DynamicMetadata';
import { Loader2 } from 'lucide-react';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';

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
    <>
      <ScrollToTop />
      <DynamicMetadata />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/artikel" element={<ArticlesPage />} />
          <Route path="/artikel/:slug" element={<ArticleDetailPage />} />

          {/* Profile Routes */}
          <Route path="/profil/visi-misi" element={<VisionMissionPage />} />
          <Route path="/profil/sejarah" element={<HistoryPage />} />
          <Route path="/profil/struktur" element={<StructurePage />} />
          <Route path="/profil/lokasi" element={<LocationPage />} />
        </Route>

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
        <Route
          path="/admin/pengaturan"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pengguna"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminUsersPage />
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
    </>
  );
}

export default App;
