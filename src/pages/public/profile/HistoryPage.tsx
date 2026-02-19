import { Calendar, History, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSetting, usePublicSettings } from '@/features/settings/hooks/useSettings';
import { Skeleton } from '@/components/ui/skeleton';

// Render teks multi-paragraf (pisah berdasarkan \n\n)
function MultiParagraph({ text }: { text: string }) {
    const content = text || '';
    const paragraphs = content.split('\n\n').filter(Boolean);
    return (
        <>
            {paragraphs.map((p, i) => (
                <p key={i} className={i < paragraphs.length - 1 ? 'mb-4' : ''}>
                    {p}
                </p>
            ))}
        </>
    );
}

export function HistoryPage() {
    const { isLoading: isSettingsLoading } = usePublicSettings();
    const founding = useSetting('history_founding');
    const development = useSetting('history_development');
    const present = useSetting('history_present');

    return (
        <div className="container mx-auto px-4 py-12 space-y-16">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                    <History className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-primary">
                    Sejarah Kami
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Perjalanan dakwah dan pergerakan Muhammadiyah di wilayah ini.
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Awal Mula Berdiri */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-semibold">Awal Mula Berdiri</h2>
                    </div>
                    <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="pt-6 text-muted-foreground leading-relaxed">
                            {isSettingsLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ) : (
                                <div className="animate-in fade-in duration-700">
                                    <MultiParagraph text={founding} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* Masa Pengembangan */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-semibold">Masa Pengembangan</h2>
                    </div>
                    <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="pt-6 text-muted-foreground leading-relaxed">
                            {isSettingsLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            ) : (
                                <div className="animate-in fade-in duration-700">
                                    <MultiParagraph text={development} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Masa Kini */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <History className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-semibold">Masa Kini</h2>
                    </div>
                    <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow bg-primary/5">
                        <CardContent className="pt-6 text-muted-foreground leading-relaxed">
                            {isSettingsLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ) : (
                                <div className="animate-in fade-in duration-700">
                                    <MultiParagraph text={present} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
