import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi, uploadApi, type CreateArticleInput, type UpdateArticleInput } from '../api';
import type { ArticleFilters } from '@/shared/types';

// Query keys
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters: ArticleFilters) => [...articleKeys.lists(), filters] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
  adminDetail: (id: string) => [...articleKeys.details(), 'admin', id] as const,
};

// Public hooks
export const usePublicArticles = (filters: ArticleFilters = {}) => {
  return useQuery({
    queryKey: articleKeys.list(filters),
    queryFn: () => articlesApi.getPublicArticles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePublicArticle = (slug: string) => {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => articlesApi.getPublicArticle(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
  });
};

// Admin hooks
export const useAdminArticles = (filters: ArticleFilters = {}) => {
  return useQuery({
    queryKey: [...articleKeys.list(filters), 'admin'],
    queryFn: () => articlesApi.getAdminArticles(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useAdminArticle = (id: string) => {
  return useQuery({
    queryKey: articleKeys.adminDetail(id),
    queryFn: () => articlesApi.getAdminArticle(id),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!id,
  });
};

// Mutations
export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleInput) => articlesApi.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleInput }) =>
      articlesApi.updateArticle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.adminDetail(variables.id) });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articlesApi.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
};

// Upload hooks
export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadApi.uploadImage,
  });
};

export const useUploadThumbnail = () => {
  return useMutation({
    mutationFn: uploadApi.uploadThumbnail,
  });
};
