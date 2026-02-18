import { z } from 'zod';

export const articleSchema = z.object({
    title: z.string().min(5, 'Judul minimal 5 karakter').max(200, 'Judul maksimal 200 karakter'),
    slug: z.string().min(3, 'Slug minimal 3 karakter').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
    content: z.string().min(50, 'Konten minimal 50 karakter'),
    excerpt: z.string().max(500, 'Ringkasan maksimal 500 karakter').optional(),
    thumbnailUrl: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    visibility: z.enum(['PUBLIC', 'PRIVATE', 'MEMBERS_ONLY']),
    metaTitle: z.string().max(70, 'Meta title maksimal 70 karakter').optional(),
    metaDescription: z.string().max(160, 'Meta description maksimal 160 karakter').optional(),
    publishedAt: z.string().optional(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
