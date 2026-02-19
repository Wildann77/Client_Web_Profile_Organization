import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSetting } from '@/features/settings/hooks/useSettings';

const DEFAULT_MAPS_URL =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15812.213256093815!2d110.36098065541992!3d-7.784131500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5828f7d9830d%3A0x6b4458514197e59c!2sGedung%20Pimpinan%20Pusat%20Muhammadiyah!5e0!3m2!1sid!2sid!4v1708244555000!5m2!1sid!2sid';

export function LocationPage() {
    const address = useSetting('contact_address');
    const phone = useSetting('contact_phone');
    const whatsapp = useSetting('contact_whatsapp');
    const email = useSetting('contact_email');
    const mapsUrl = useSetting('contact_maps_url');
    const hoursWeekday = useSetting('office_hours_weekday');
    const hoursSaturday = useSetting('office_hours_saturday');
    const hoursSunday = useSetting('office_hours_sunday');

    const embedUrl = mapsUrl || DEFAULT_MAPS_URL;

    return (
        <div className="container mx-auto px-4 py-12 space-y-16">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-primary">
                    Lokasi &amp; Kontak
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Kunjungi kantor kami atau hubungi kami untuk informasi lebih lanjut.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Info Cards */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Alamat */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="text-primary h-5 w-5" />
                                Alamat Kantor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground space-y-1">
                            {address ? (
                                address.split('\n').map((line, i) => <p key={i}>{line}</p>)
                            ) : (
                                <p className="italic text-muted-foreground/60 text-sm">Belum dikonfigurasi</p>
                            )}
                            {mapsUrl && (
                                <Button
                                    variant="link"
                                    className="px-0 mt-2 h-auto text-primary"
                                    asChild
                                >
                                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                                        Buka di Google Maps &rarr;
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Telepon & WhatsApp */}
                    {(phone || whatsapp) && (
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="text-primary h-5 w-5" />
                                    Telepon &amp; WhatsApp
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-muted-foreground">
                                {phone && (
                                    <div className="flex justify-between">
                                        <span>Telepon:</span>
                                        <a href={`tel:${phone}`} className="font-medium text-foreground hover:text-primary transition-colors">
                                            {phone}
                                        </a>
                                    </div>
                                )}
                                {whatsapp && (
                                    <div className="flex justify-between">
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-3 h-3" /> WhatsApp:
                                        </span>
                                        <a
                                            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-foreground hover:text-primary transition-colors"
                                        >
                                            {whatsapp}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Email */}
                    {email && (
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="text-primary h-5 w-5" />
                                    Email
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                <a
                                    href={`mailto:${email}`}
                                    className="font-medium text-foreground hover:text-primary transition-colors break-all"
                                >
                                    {email}
                                </a>
                            </CardContent>
                        </Card>
                    )}

                    {/* Jam Operasional */}
                    <Card className="shadow-md bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="text-primary h-5 w-5" />
                                Jam Operasional
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Senin - Jumat:</span>
                                <span className="font-medium text-foreground">
                                    {hoursWeekday || '08.00 - 16.00'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sabtu:</span>
                                <span className="font-medium text-foreground">
                                    {hoursSaturday || 'Libur'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Minggu:</span>
                                <span className="font-medium text-foreground">
                                    {hoursSunday || 'Tutup'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Map Embed */}
                <div className="lg:col-span-2 min-h-[400px] h-full rounded-xl overflow-hidden shadow-lg border-2 border-muted bg-muted/20 relative">
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, minHeight: '500px' }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                    />
                </div>
            </div>
        </div>
    );
}
