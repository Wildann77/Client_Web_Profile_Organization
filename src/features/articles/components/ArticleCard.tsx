import { Link } from 'react-router-dom';
import type { Article } from '@/shared/types';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, truncateText, stripHtml } from '@/shared/lib/utils';
import { Calendar, Eye, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
}

export const ArticleCard = ({ article, variant = 'default' }: ArticleCardProps) => {
  const content = article.excerpt || truncateText(stripHtml(article.content), 150);

  if (variant === 'compact') {
    return (
      <Link to={`/artikel/${article.slug}`}>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <h3 className="font-semibold line-clamp-2 mb-2">{article.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.viewCount}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/artikel/${article.slug}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video bg-gray-100 relative">
            {article.thumbnailUrl ? (
              <img
                src={article.thumbnailUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <span className="text-gray-400 text-4xl">📰</span>
              </div>
            )}
          </div>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h2>
            <p className="text-muted-foreground mb-4 line-clamp-3">{content}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {article.author.name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/artikel/${article.slug}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="aspect-video bg-gray-100 relative">
          {article.thumbnailUrl ? (
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-gray-400 text-3xl">📰</span>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{content}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
