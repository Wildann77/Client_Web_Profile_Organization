import { Target, Compass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSetting, usePublicSettings } from '@/features/settings/hooks/useSettings';

export function VisionMissionPage() {
    const { isLoading: isSettingsLoading } = usePublicSettings();
    const vision = useSetting('org_vision');
    const mission1 = useSetting('org_mission_1');
    const mission2 = useSetting('org_mission_2');
    const mission3 = useSetting('org_mission_3');

    const missions = [mission1, mission2, mission3].filter(Boolean);

    return (
        <div className="container mx-auto px-4 py-12 space-y-16">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-primary">
                    Visi &amp; Misi
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Landasan pergerakan dan cita-cita luhur Muhammadiyah dalam membangun masyarakat Islam yang sebenar-benarnya.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Visi Section */}
                <Card className="flex flex-col h-full border-t-4 border-t-primary shadow-lg hover:shadow-xl transition-shadow bg-blue-50/50 dark:bg-blue-900/10">
                    <CardHeader className="space-y-4 text-center pb-2">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                            <Target className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Visi Kami</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 text-center px-8 pb-8">
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {!isSettingsLoading && vision && <>&ldquo;{vision}&rdquo;</>}
                        </p>
                    </CardContent>
                </Card>

                {/* Misi Section */}
                <Card className="flex flex-col h-full border-t-4 border-t-primary shadow-lg hover:shadow-xl transition-shadow bg-blue-50/50 dark:bg-blue-900/10">
                    <CardHeader className="space-y-4 text-center pb-2">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                            <Compass className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Misi Kami</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 px-8 pb-8">
                        <ul className="space-y-4 text-muted-foreground">
                            {!isSettingsLoading && missions.map((m, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                                    <span>{m}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
