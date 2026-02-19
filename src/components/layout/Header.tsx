import { Link } from 'react-router-dom';
import { ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useSetting, usePublicSettings } from '@/features/settings/hooks/useSettings';
import { useState } from 'react';

export function Header() {
    const { isLoading: isSettingsLoading } = usePublicSettings();
    const siteName = useSetting('site_name');
    const siteLogo = useSetting('site_logo');
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { to: '/', label: 'Beranda' },
        { to: '/artikel', label: 'Artikel' },
    ];

    const profileLinks = [
        { to: '/profil/visi-misi', label: 'Visi & Misi' },
        { to: '/profil/sejarah', label: 'Sejarah' },
        { to: '/profil/struktur', label: 'Struktur Organisasi' },
        { to: '/profil/lokasi', label: 'Lokasi & Kontak' },
    ];

    return (
        <header className="border-b bg-card sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        {isSettingsLoading ? (
                            <Skeleton className="h-8 w-8 rounded-full" />
                        ) : (
                            siteLogo && (
                                <img src={siteLogo} alt={siteName || 'Logo'} className="h-8 w-8 object-contain animate-in fade-in duration-700" />
                            )
                        )}
                        <span className="font-bold text-lg md:text-xl truncate max-w-[150px] sm:max-w-none min-w-[100px]">
                            {isSettingsLoading ? (
                                <Skeleton className="h-6 w-32" />
                            ) : (
                                <span className="animate-in fade-in slide-in-from-left-2 duration-700">{siteName}</span>
                            )}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                            Beranda
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors outline-none text-sm font-medium">
                                Profil <ChevronDown className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {profileLinks.map((link) => (
                                    <DropdownMenuItem key={link.to} asChild>
                                        <Link to={link.to} className="cursor-pointer w-full">{link.label}</Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link to="/artikel" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                            Artikel
                        </Link>

                        <div className="flex items-center gap-2 ml-2">
                            <ModeToggle />
                        </div>
                    </nav>

                    {/* Mobile Navigation */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ModeToggle />
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Menu">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="p-0 flex flex-col">
                                <SheetHeader className="px-6 py-4 border-b text-left">
                                    <SheetTitle className="flex items-center gap-2 truncate">
                                        {isSettingsLoading ? (
                                            <>
                                                <Skeleton className="h-6 w-6 rounded-full" />
                                                <Skeleton className="h-5 w-24" />
                                            </>
                                        ) : (
                                            <>
                                                {siteLogo && (
                                                    <img src={siteLogo} alt={siteName || 'Logo'} className="h-6 w-6 object-contain" />
                                                )}
                                                <span className="truncate">{siteName}</span>
                                            </>
                                        )}
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex-1 flex flex-col py-6">
                                    <div className="px-6 space-y-4">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.to}
                                                to={link.to}
                                                className="block text-lg font-medium hover:text-primary"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="px-6 mt-8">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Profil</p>
                                        <div className="space-y-4">
                                            {profileLinks.map((link) => (
                                                <Link
                                                    key={link.to}
                                                    to={link.to}
                                                    className="block text-base text-muted-foreground hover:text-primary"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
