import { get, post, patch, del } from '@/shared/lib/api';
import type { Article, ArticleFilters, UploadResult } from '@/shared/types';

export interface CreateArticleInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnailUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  visibility: 'PUBLIC' | 'PRIVATE' | 'MEMBERS_ONLY';
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> { }

export interface ArticlesResponse {
  articles: Article[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const articlesApi = {
  // Get public articles
  getPublicArticles: async (filters?: ArticleFilters): Promise<ArticlesResponse> => {
    return get<ArticlesResponse>('/articles/public', filters as Record<string, unknown>);
  },

  // Get public article by slug
  getPublicArticle: async (slug: string): Promise<Article> => {
    return get<Article>(`/articles/public/${slug}`);
  },

  // Get admin articles
  getAdminArticles: async (filters?: ArticleFilters): Promise<ArticlesResponse> => {
    return get<ArticlesResponse>('/articles', filters as Record<string, unknown>);
  },

  // Get admin article by id
  getAdminArticle: async (id: string): Promise<Article> => {
    return get<Article>(`/articles/${id}`);
  },

  // Create article
  createArticle: async (data: CreateArticleInput): Promise<Article> => {
    return post<Article>('/articles', data);
  },

  // Update article
  updateArticle: async (id: string, data: UpdateArticleInput): Promise<Article> => {
    return patch<Article>(`/articles/${id}`, data);
  },

  // Delete article
  deleteArticle: async (id: string): Promise<void> => {
    return del(`/articles/${id}`);
  },
};

export const uploadApi = {
  // Upload image
  uploadImage: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/v1/upload/image', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const result = await response.json();
    return result.data;
  },

  // Upload thumbnail
  uploadThumbnail: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/v1/upload/thumbnail', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const result = await response.json();
    return result.data;
  },

  // Upload setting image (hero, etc)
  uploadSettingImage: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/v1/upload/settings', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const result = await response.json();
    return result.data;
  },
};

