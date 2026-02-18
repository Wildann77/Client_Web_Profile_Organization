import { Link } from 'react-router-dom';
import { usePublicArticles } from '@/features/articles/hooks/useArticles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search } from 'lucide-react';
import { ArticleList } from '@/features/articles/components/ArticleList';
import { ArticleListSkeleton } from '@/features/articles/components/ArticleListSkeleton';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
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
        <ArticleListSkeleton count={12} columns={3} />
      ) : (
        <ArticleList articles={data?.articles || []} columns={3} />
      )}
    </div>
  );
};
