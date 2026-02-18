import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useSetting } from '@/features/settings/hooks/useSettings';

export function Footer() {
    const siteName = useSetting('site_name');
    const siteDescription = useSetting('site_description');
    const contactEmail = useSetting('contact_email');
    const contactPhone = useSetting('contact_phone');
    const contactAddress = useSetting('contact_address');
    const socialFacebook = useSetting('social_facebook');
    const socialInstagram = useSetting('social_instagram');
    const socialYoutube = useSetting('social_youtube');

    const displayName = siteName || 'Organisasi Kami';
    const displayDesc = siteDescription || 'Website resmi organisasi kami. Memberikan informasi dan pelayanan terbaik untuk masyarakat.';

    return (
        <footer className="bg-gradient-to-br from-primary/5 to-primary/10 border-t py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Kolom 1 — Identitas */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">{displayName}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {displayDesc}
                        </p>

                        {/* Sosial Media */}
                        {(socialFacebook || socialInstagram || socialYoutube) && (
                            <div className="flex items-center gap-3 mt-4">
                                {socialFacebook && (
                                    <a
                                        href={socialFacebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                        aria-label="Facebook"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                )}
                                {socialInstagram && (
                                    <a
                                        href={socialInstagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                        aria-label="Instagram"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                                {socialYoutube && (
                                    <a
                                        href={socialYoutube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                        aria-label="YouTube"
                                    >
                                        <Youtube className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Kolom 2 — Tautan Cepat */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Tautan Cepat</h3>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            <li>
                                <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
                            </li>
                            <li>
                                <Link to="/artikel" className="hover:text-primary transition-colors">Artikel</Link>
                            </li>
                            <li>
                                <Link to="/profil/visi-misi" className="hover:text-primary transition-colors">Visi &amp; Misi</Link>
                            </li>
                            <li>
                                <Link to="/profil/lokasi" className="hover:text-primary transition-colors">Lokasi &amp; Kontak</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kolom 3 — Kontak */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Kontak</h3>
                        <ul className="space-y-3 text-muted-foreground text-sm">
                            {contactEmail && (
                                <li className="flex items-start gap-2">
                                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                                    <a href={`mailto:${contactEmail}`} className="hover:text-primary transition-colors break-all">
                                        {contactEmail}
                                    </a>
                                </li>
                            )}
                            {contactPhone && (
                                <li className="flex items-start gap-2">
                                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                                    <a href={`tel:${contactPhone}`} className="hover:text-primary transition-colors">
                                        {contactPhone}
                                    </a>
                                </li>
                            )}
                            {contactAddress && (
                                <li className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                                    <span>{contactAddress}</span>
                                </li>
                            )}
                            {!contactEmail && !contactPhone && !contactAddress && (
                                <li className="text-muted-foreground/60 italic text-xs">
                                    Belum ada kontak yang dikonfigurasi.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-muted mt-8 pt-8 text-center text-muted-foreground text-sm">
                    <p>&copy; {new Date().getFullYear()} {displayName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
