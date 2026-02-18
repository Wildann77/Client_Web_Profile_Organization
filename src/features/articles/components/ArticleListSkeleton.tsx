import { ArticleCardSkeleton } from './ArticleCardSkeleton';

interface ArticleListSkeletonProps {
  columns?: 1 | 2 | 3 | 4;
  count?: number;
}

export function ArticleListSkeleton({ 
  columns = 3,
  count = 6 
}: ArticleListSkeletonProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <ArticleCardSkeleton key={index} />
      ))}
    </div>
  );
}
