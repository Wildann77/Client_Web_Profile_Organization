import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePublicArticles } from '@/features/articles/hooks/useArticles';
import { ArticleList } from '@/features/articles/components/ArticleList';
import { ArticleListSkeleton } from '@/features/articles/components/ArticleListSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Target, History, Users, MapPin, Newspaper, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import { useSetting } from '@/features/settings/hooks/useSettings';

const profileLinks = [
  {
    icon: Target,
    title: 'Visi & Misi',
    description: 'Tujuan dan landasan pergerakan organisasi.',
    href: '/profil/visi-misi',
  },
  {
    icon: History,
    title: 'Sejarah',
    description: 'Perjalanan panjang dakwah dan pengabdian.',
    href: '/profil/sejarah',
  },
  {
    icon: Users,
    title: 'Struktur Organisasi',
    description: 'Susunan kepengurusan periode 2022–2027.',
    href: '/profil/struktur',
  },
  {
    icon: MapPin,
    title: 'Lokasi & Kontak',
    description: 'Temukan kami dan hubungi langsung.',
    href: '/profil/lokasi',
  },
];

export const HomePage = () => {
  const { data, isLoading } = usePublicArticles({ limit: 6 });
  const siteName = useSetting('site_name');
  const heroImageUrl = useSetting('hero_image_url');
  const heroSubtitle = useSetting('hero_subtitle');
  const [heroLoading, setHeroLoading] = useState(true);

  return (
    <div className="space-y-0">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Base Background (Natural Gradient while loading) */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,var(--color-primary)_0%,transparent_50%)] animate-pulse" />

        {/* Loading Indicator */}
        {heroLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-[2px]">
            <div className="relative">
              {/* Soft Pulsating Glow */}
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping scale-125" />
              {/* Minimal Spinner */}
              <div className="relative bg-white/10 p-3 rounded-full border border-white/20 backdrop-blur-md">
                <Loader2 className="w-8 h-8 text-white animate-spin opacity-80" />
              </div>
            </div>
          </div>
        )}

        {/* Cover image */}
        {heroImageUrl && (
          <img
            src={heroImageUrl}
            alt={`${siteName || 'Muhammadiyah'} hero cover`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${heroLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              }`}
            onLoad={() => setHeroLoading(false)}
            onError={() => setHeroLoading(false)}
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Newspaper className="w-4 h-4" />
            Organisasi Islam Berkemajuan
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-lg text-white">
            Selamat Datang di{' '}
            <span className="text-white dark:text-blue-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-colors duration-300">
              {siteName || 'Muhammadiyah'}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            {heroSubtitle || "Bersama membangun masyarakat Islam yang sebenar-benarnya — melalui dakwah, pendidikan, dan amal sosial."}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/artikel">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg shadow-primary/30">
                Baca Artikel
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/profil/visi-misi">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
              >
                Tentang Kami
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Profile Quick Links ── */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Profil Organisasi</h2>
            <p className="text-muted-foreground">Kenali lebih dekat siapa kami dan apa yang kami perjuangkan.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profileLinks.map(({ icon: Icon, title, description, href }) => (
              <Link key={href} to={href} className="group">
                <Card className="h-full border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    <span className="text-xs text-primary font-medium flex items-center gap-1 mt-auto">
                      Selengkapnya <ArrowRight className="w-3 h-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Articles ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-1">Artikel Terbaru</h2>
              <p className="text-muted-foreground text-sm">Informasi dan kajian terkini dari kami.</p>
            </div>
            <Link to="/artikel">
              <Button variant="ghost" className="gap-2 text-primary">
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <ArticleListSkeleton count={3} columns={3} />
          ) : (
            <ArticleList articles={data?.articles || []} columns={3} />
          )}
        </div>
      </section>
    </div>
  );
};
