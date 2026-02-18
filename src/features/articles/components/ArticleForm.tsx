import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ImageIcon, X } from 'lucide-react';
import { useUploadThumbnail } from '../hooks/useArticles';
import { generateSlug } from '@/shared/lib/utils';
import type { Article } from '@/shared/types';

const articleSchema = z.object({
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

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  article?: Article;
  onSubmit: (data: ArticleFormData) => void;
  isSubmitting?: boolean;
}

export const ArticleForm = ({ article, onSubmit, isSubmitting = false }: ArticleFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const uploadThumbnail = useUploadThumbnail();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || '',
      slug: article?.slug || '',
      content: article?.content || '',
      excerpt: article?.excerpt || '',
      thumbnailUrl: article?.thumbnailUrl || '',
      status: article?.status || 'DRAFT',
      visibility: article?.visibility || 'PUBLIC',
      metaTitle: article?.metaTitle || '',
      metaDescription: article?.metaDescription || '',
      publishedAt: article?.publishedAt
        ? new Date(article.publishedAt).toISOString().slice(0, 16)
        : '',
    },
  });

  const thumbnailUrl = watch('thumbnailUrl');

  // Auto-generate slug from title
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue('title', newTitle);
    if (!article) {
      setValue('slug', generateSlug(newTitle));
    }
  }, [setValue, article]);

  // Handle thumbnail upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Compress image before upload
      const { compressImage } = await import('@/shared/lib/imageCompression');
      const compressedFile = await compressImage(file);

      const result = await uploadThumbnail.mutateAsync(compressedFile);
      setValue('thumbnailUrl', result.secureUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Gagal mengupload thumbnail');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Konten</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Artikel</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul artikel"
                  {...register('title')}
                  onChange={handleTitleChange}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug URL</Label>
                <Input
                  id="slug"
                  placeholder="judul-artikel"
                  {...register('slug')}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  URL: /artikel/{watch('slug')}
                </p>
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <div className="flex items-center gap-4">
                  {thumbnailUrl ? (
                    <div className="relative w-32 h-20">
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setValue('thumbnailUrl', '')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      id="thumbnail-upload"
                      disabled={isUploading}
                    />
                    <label htmlFor="thumbnail-upload">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isUploading}
                        asChild
                      >
                        <span>
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Upload Thumbnail'
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Ringkasan singkat artikel (opsional)"
                  rows={3}
                  {...register('excerpt')}
                />
                {errors.excerpt && (
                  <p className="text-sm text-red-500">{errors.excerpt.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Konten Artikel</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TiptapEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="Tulis konten artikel di sini..."
                  />
                )}
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-2">{errors.content.message}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Publikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Dipublikasikan</SelectItem>
                        <SelectItem value="ARCHIVED">Diarsipkan</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibilitas</Label>
                <Controller
                  name="visibility"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih visibilitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Publik</SelectItem>
                        <SelectItem value="PRIVATE">Pribadi</SelectItem>
                        <SelectItem value="MEMBERS_ONLY">Hanya Member</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Published At */}
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Tanggal Publikasi</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  {...register('publishedAt')}
                />
                <p className="text-xs text-muted-foreground">
                  Kosongkan untuk mempublikasikan sekarang
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta Title */}
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  placeholder="Judul untuk SEO (opsional)"
                  {...register('metaTitle')}
                />
                <p className="text-xs text-muted-foreground">
                  Maksimal 70 karakter. Kosongkan untuk menggunakan judul artikel.
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Deskripsi untuk SEO (opsional)"
                  rows={3}
                  {...register('metaDescription')}
                />
                <p className="text-xs text-muted-foreground">
                  Maksimal 160 karakter.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[150px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : article ? (
            'Perbarui Artikel'
          ) : (
            'Buat Artikel'
          )}
        </Button>
      </div>
    </form>
  );
};
