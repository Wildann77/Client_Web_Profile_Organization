import { Skeleton } from '@/components/ui/skeleton';

export function ArticleDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button Skeleton */}
      <Skeleton className="h-5 w-48 mb-6" />

      {/* Article Card */}
      <div className="bg-card rounded-lg shadow-sm overflow-hidden border">
        {/* Thumbnail Skeleton */}
        <Skeleton className="aspect-video w-full" />

        <div className="p-6 md:p-8">
          {/* Meta Skeleton */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Title Skeleton */}
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-10 w-2/3 mb-8" />

          {/* Content Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
