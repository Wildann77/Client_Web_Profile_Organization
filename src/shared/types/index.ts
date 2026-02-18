// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    details?: Record<string, string[]>;
  };
  timestamp: string;
}

// User types
export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
}

// Article types
export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ArticleVisibility = 'PUBLIC' | 'PRIVATE' | 'MEMBERS_ONLY';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnailUrl: string | null;
  status: ArticleStatus;
  visibility: ArticleVisibility;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    avatarUrl: string | null;
  };
}

export interface ArticleFilters {
  page?: number;
  limit?: number;
  status?: ArticleStatus;
  visibility?: ArticleVisibility;
  search?: string;
  authorId?: string;
}

// Upload types
export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

// Dashboard types
export interface DashboardStats {
  stats: {
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    totalUsers: number;
    totalViews: number;
  };
  recentArticles: Article[];
}
// Setting types
export interface Setting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  isPublic: boolean;
  updatedAt: string;
  updatedBy: string | null;
}
