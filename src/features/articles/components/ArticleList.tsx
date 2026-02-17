import { ArticleCard } from './ArticleCard';
import type { Article } from '@/shared/types';
import { Loader2 } from 'lucide-react';

interface ArticleListProps {
  articles: Article[];
  isLoading?: boolean;
  columns?: 1 | 2 | 3 | 4;
}

export const ArticleList = ({ 
  articles, 
  isLoading = false,
  columns = 3 
}: ArticleListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada artikel</p>
      </div>
    );
  }

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};
