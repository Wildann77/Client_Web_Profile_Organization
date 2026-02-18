import { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Settings, Upload, X, Image } from 'lucide-react';
import { useAdminSettings, useUpdateBulkSettings } from '@/features/settings/hooks/useSettings';
import { uploadApi } from '@/features/articles/api';
import { toast } from 'sonner';

type FieldType = 'input' | 'textarea' | 'image';

interface SettingField {
    key: string;
    label: string;
    type?: FieldType;
    placeholder?: string;
}

interface SettingGroup {
    title: string;
    description: string;
    keys: SettingField[];
}

// Kelompok setting yang ditampilkan di UI
const SETTING_GROUPS: SettingGroup[] = [
    {
        title: 'Informasi Website',
        description: 'Pengaturan dasar identitas website.',
        keys: [
            { key: 'site_name', label: 'Nama Website' },
            { key: 'site_logo', label: 'Logo Website', type: 'image' },
            { key: 'site_description', label: 'Deskripsi Website', type: 'textarea' },
        ],
    },
    {
        title: 'Hero Halaman Utama',
        description: 'Konten yang tampil di bagian atas halaman beranda.',
        keys: [
            { key: 'hero_image_url', label: 'Gambar Hero', type: 'image' },
            { key: 'hero_subtitle', label: 'Subtitle Hero', type: 'textarea' },
        ],
    },
    {
        title: 'Visi & Misi',
        description: 'Visi dan misi organisasi yang ditampilkan di halaman profil.',
        keys: [
            { key: 'org_vision', label: 'Visi', type: 'textarea' },
            { key: 'org_mission_1', label: 'Misi ke-1', type: 'textarea' },
            { key: 'org_mission_2', label: 'Misi ke-2', type: 'textarea' },
            { key: 'org_mission_3', label: 'Misi ke-3', type: 'textarea' },
        ],
    },
    {
        title: 'Sejarah',
        description: 'Narasi sejarah organisasi yang ditampilkan di halaman profil.',
        keys: [
            { key: 'history_founding', label: 'Awal Mula Berdiri', type: 'textarea' },
            { key: 'history_development', label: 'Masa Pengembangan', type: 'textarea' },
            { key: 'history_present', label: 'Masa Kini', type: 'textarea' },
        ],
    },
    {
        title: 'Kontak',
        description: 'Informasi kontak yang ditampilkan ke publik.',
        keys: [
            { key: 'contact_email', label: 'Email Kontak' },
            { key: 'contact_phone', label: 'Nomor Telepon' },
            { key: 'contact_whatsapp', label: 'Nomor WhatsApp' },
            { key: 'contact_address', label: 'Alamat Kantor', type: 'textarea' },
            { key: 'contact_maps_url', label: 'URL Embed Google Maps', placeholder: 'https://www.google.com/maps/embed?...' },
        ],
    },
    {
        title: 'Jam Operasional',
        description: 'Jam buka kantor yang ditampilkan di halaman lokasi.',
        keys: [
            { key: 'office_hours_weekday', label: 'Senin - Jumat', placeholder: '08.00 - 16.00' },
            { key: 'office_hours_saturday', label: 'Sabtu', placeholder: '08.00 - 12.00' },
        ],
    },
    {
        title: 'Media Sosial',
        description: 'Tautan media sosial organisasi.',
        keys: [
            { key: 'social_facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
            { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
            { key: 'social_youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
        ],
    },
];

// ── Image Upload Field ────────────────────────────────────────────────────────
function ImageUploadField({
    fieldKey,
    label,
    value,
    onChange,
}: {
    fieldKey: string;
    label: string;
    value: string;
    onChange: (key: string, value: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const result = await uploadApi.uploadSettingImage(file);
            onChange(fieldKey, result.secureUrl);
            toast.success('Gambar berhasil diupload');
        } catch {
            toast.error('Gagal mengupload gambar');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
            <Label className="sm:text-right text-sm font-medium pt-2">{label}</Label>
            <div className="sm:col-span-2 space-y-3">
                {/* Preview */}
                {value && (
                    <div className="relative w-full max-w-sm rounded-lg overflow-hidden border bg-muted aspect-video">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <button
                            type="button"
                            onClick={() => onChange(fieldKey, '')}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-90"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}
                {/* URL Input */}
                <Input
                    id={fieldKey}
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    placeholder="https://... atau upload file di bawah"
                />
                {/* Upload Button */}
                <div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={uploading}
                        onClick={() => inputRef.current?.click()}
                    >
                        {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        {uploading ? 'Mengupload...' : 'Upload Gambar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export const AdminSettingsPage = () => {
    const { data: settings, isLoading } = useAdminSettings();
    const { mutate: updateBulk, isPending } = useUpdateBulkSettings();

    const [form, setForm] = useState<Record<string, string>>({});

    useEffect(() => {
        if (settings) {
            const initial: Record<string, string> = {};
            settings.forEach((s) => { initial[s.key] = s.value; });
            setForm(initial);
        }
    }, [settings]);

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        updateBulk(form, {
            onSuccess: () => toast.success('Pengaturan berhasil disimpan'),
            onError: () => toast.error('Gagal menyimpan pengaturan'),
        });
    };

    const renderField = (field: SettingField) => {
        const { key, label, type = 'input', placeholder } = field;
        const value = form[key] ?? '';

        if (type === 'image') {
            return (
                <ImageUploadField
                    key={key}
                    fieldKey={key}
                    label={label}
                    value={value}
                    onChange={handleChange}
                />
            );
        }

        if (type === 'textarea') {
            return (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
                    <Label htmlFor={key} className="sm:text-right text-sm font-medium pt-2">
                        {label}
                    </Label>
                    <Textarea
                        id={key}
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={placeholder ?? `Masukkan ${label.toLowerCase()}...`}
                        className="sm:col-span-2 min-h-[80px] resize-y"
                    />
                </div>
            );
        }

        return (
            <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <Label htmlFor={key} className="sm:text-right text-sm font-medium">
                    {label}
                </Label>
                <Input
                    id={key}
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder ?? `Masukkan ${label.toLowerCase()}...`}
                    className="sm:col-span-2"
                />
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Settings className="w-6 h-6 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold">Pengaturan</h1>
                            <p className="text-sm text-muted-foreground">Kelola konfigurasi website organisasi.</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={isPending || isLoading} className="gap-2">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Simpan Semua
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {SETTING_GROUPS.map((group) => (
                            <Card key={group.title}>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        {group.title === 'Hero Halaman Utama' && <Image className="w-4 h-4 text-primary" />}
                                        {group.title}
                                    </CardTitle>
                                    <CardDescription>{group.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {group.keys.map((field) => renderField(field))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
