import { Link } from 'react-router-dom';
import { usePublicArticles } from '@/features/articles/hooks/useArticles';
import { ArticleList } from '@/features/articles/components/ArticleList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Search, Newspaper } from 'lucide-react';
import { useState } from 'react';

export const ArticlesPage = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading, refetch } = usePublicArticles({ 
    limit: 12,
    search: search || undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <Newspaper className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Organisasi Kami</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-primary">Beranda</Link>
              <Link to="/artikel" className="text-gray-700 hover:text-primary">Artikel</Link>
              <Link to="/admin/login">
                <Button variant="outline" size="sm">Admin Login</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Semua Artikel</h1>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <Input
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="secondary">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Articles */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ArticleList articles={data?.articles || []} columns={3} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Organisasi Kami. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
