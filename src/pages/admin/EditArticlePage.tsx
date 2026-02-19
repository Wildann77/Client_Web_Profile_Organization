import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAdminArticle, useUpdateArticle } from '@/features/articles/hooks/useArticles';
import { ArticleForm } from '@/features/articles/components/ArticleForm';
import { type ArticleFormData } from '@/features/articles/schemas/articleSchema';
import { handleError } from '@/shared/lib/errorHandler';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const EditArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: article, isLoading } = useAdminArticle(id || '');
  const updateArticle = useUpdateArticle();

  const handleSubmit = async (values: ArticleFormData) => {
    if (!id) return;

    try {
      // Convert local datetime-local string to ISO string for backend
      const data = { ...values };
      if (data.publishedAt) {
        data.publishedAt = new Date(data.publishedAt).toISOString();
      } else {
        // If empty string, tell backend to set it to null
        data.publishedAt = '';
      }

      await updateArticle.mutateAsync({ id, data });
      toast.success('Artikel berhasil diperbarui');
      navigate('/admin/artikel');
    } catch (error) {
      handleError(error, {
        fallbackMessage: 'Gagal memperbarui artikel',
        context: 'EditArticlePage',
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!article) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">Artikel tidak ditemukan</h2>
          <Link to="/admin/artikel">
            <Button>Kembali ke Daftar Artikel</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/admin/artikel">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Artikel</h1>
        </div>

        {/* Form */}
        <ArticleForm
          article={article}
          onSubmit={handleSubmit}
          isSubmitting={updateArticle.isPending}
        />
      </div>
    </AdminLayout>
  );
};
