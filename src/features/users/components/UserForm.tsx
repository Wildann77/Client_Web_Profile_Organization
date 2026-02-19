import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { UserRole } from '@/shared/types';
import type { User } from '../api';
import { Loader2 } from 'lucide-react';

const UserRoleEnum = {
    ADMIN: 'ADMIN' as UserRole,
    EDITOR: 'EDITOR' as UserRole,
};

const formSchema = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    role: z.nativeEnum(UserRoleEnum),
    password: z.string().min(8, 'Password minimal 8 karakter').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

// Export type untuk digunakan di komponen lain
export type UserFormData = FormValues;

interface UserFormProps {
    user?: User;
    onSubmit: (data: UserFormData) => void;
    isLoading: boolean;
}

export function UserForm({ user, onSubmit, isLoading }: UserFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            role: user?.role || UserRoleEnum.EDITOR,
            password: '',
        },
    });

    const handleSubmit = (values: FormValues) => {
        // If updating, only send password if it's not empty
        const data = { ...values };
        if (user && !data.password) {
            delete data.password;
        }
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                                <Input placeholder="Budi Santoso" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="budi@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={UserRoleEnum.ADMIN}>Admin</SelectItem>
                                    <SelectItem value={UserRoleEnum.EDITOR}>Editor</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Admin memiliki akses penuh, Editor hanya bisa mengelola artikel.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{user ? 'Password Baru (Opsional)' : 'Password'}</FormLabel>
                            <FormControl>
                                <Input placeholder="********" type="password" {...field} />
                            </FormControl>
                            {!user && <FormDescription>Minimal 8 karakter.</FormDescription>}
                            {user && <FormDescription>Kosongkan jika tidak ingin mengubah password.</FormDescription>}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {user ? 'Perbarui Pengguna' : 'Tambah Pengguna'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
