import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useCreateArticle } from '@/features/articles/hooks/useArticles';
import { ArticleForm } from '@/features/articles/components/ArticleForm';
import { type ArticleFormData } from '@/features/articles/schemas/articleSchema';
import { handleError } from '@/shared/lib/errorHandler';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const CreateArticlePage = () => {
  const navigate = useNavigate();
  const createArticle = useCreateArticle();

  const handleSubmit = async (values: ArticleFormData) => {
    try {
      // Convert local datetime-local string to ISO string for backend
      const data = { ...values };
      if (data.publishedAt) {
        data.publishedAt = new Date(data.publishedAt).toISOString();
      } else {
        delete data.publishedAt;
      }

      await createArticle.mutateAsync(data);
      toast.success('Artikel berhasil dibuat');
      navigate('/admin/artikel');
    } catch (error) {
      handleError(error, {
        fallbackMessage: 'Gagal membuat artikel',
        context: 'CreateArticlePage',
      });
    }
  };

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
          <h1 className="text-2xl font-bold">Buat Artikel Baru</h1>
        </div>

        {/* Form */}
        <ArticleForm
          onSubmit={handleSubmit}
          isSubmitting={createArticle.isPending}
        />
      </div>
    </AdminLayout>
  );
};
