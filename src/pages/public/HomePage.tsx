import { Link } from 'react-router-dom';
import { usePublicArticles } from '@/features/articles/hooks/useArticles';
import { ArticleList } from '@/features/articles/components/ArticleList';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Newspaper } from 'lucide-react';

export const HomePage = () => {
  const { data, isLoading } = usePublicArticles({ limit: 6 });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Selamat Datang di Website Organisasi Kami
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Temukan informasi terbaru tentang kegiatan dan program kami untuk masyarakat.
          </p>
          <Link to="/artikel">
            <Button size="lg" className="gap-2">
              Lihat Artikel
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Artikel Terbaru</h2>
            <Link to="/artikel">
              <Button variant="ghost" className="gap-2">
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ArticleList articles={data?.articles || []} columns={3} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Organisasi Kami</h3>
              <p className="text-gray-400">
                Website resmi organisasi kami. Memberikan informasi dan pelayanan terbaik untuk masyarakat.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Tautan Cepat</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Beranda</Link></li>
                <li><Link to="/artikel" className="hover:text-white">Artikel</Link></li>
                <li><Link to="/admin/login" className="hover:text-white">Admin Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Kontak</h3>
              <p className="text-gray-400">
                Email: contact@organisasi.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Organisasi Kami. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
