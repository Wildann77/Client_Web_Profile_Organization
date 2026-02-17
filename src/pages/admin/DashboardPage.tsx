import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { DashboardStats } from '@/features/admin/components/DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { Loader2, FileText } from 'lucide-react';
import { get } from '@/shared/lib/api';
import type { DashboardStats as DashboardStatsType, Article } from '@/shared/types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fetchDashboardStats = async (): Promise<{
  stats: DashboardStatsType['stats'];
  recentArticles: Article[];
}> => {
  return get('/admin/dashboard');
};

export const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: fetchDashboardStats,
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link to="/admin/artikel/baru">
            <Button>Buat Artikel Baru</Button>
          </Link>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data ? (
          <DashboardStats stats={data.stats} />
        ) : null}

        {/* Recent Articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Artikel Terbaru
            </CardTitle>
            <Link to="/admin/artikel">
              <Button variant="ghost" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : data?.recentArticles?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.recentArticles.slice(0, 3).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Belum ada artikel
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
