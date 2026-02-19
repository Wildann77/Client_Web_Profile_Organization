import { useState } from 'react';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
    Users,
    UserPlus,
    Search,
    Pencil,
    Trash2,
    Loader2,
    ShieldCheck,
    Shield
} from 'lucide-react';
import {
    useAdminUsers,
    useCreateUser,
    useUpdateUser,
    useToggleUserStatus,
    useDeleteUser
} from '@/features/users/hooks/useUsers';
import type { User, CreateUserInput, UpdateUserInput } from '@/features/users/api';
import { UserForm, type UserFormData } from '@/features/users/components/UserForm';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const AdminUsersPage = () => {
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const { data: users, isLoading } = useAdminUsers({ search });
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const toggleStatus = useToggleUserStatus();
    const deleteUser = useDeleteUser();

    const handleCreateSubmit = (data: UserFormData) => {
        // Pastikan password ada untuk create user
        if (!data.password) {
            return;
        }
        const createData: CreateUserInput = {
            name: data.name,
            email: data.email,
            role: data.role,
            password: data.password,
        };
        createUser.mutate(createData, {
            onSuccess: () => setIsAddOpen(false),
        });
    };

    const handleUpdateSubmit = (data: UserFormData) => {
        if (editingUser) {
            const updateData: UpdateUserInput = {
                name: data.name,
                email: data.email,
                role: data.role,
            };
            // Hanya sertakan password jika diisi
            if (data.password) {
                updateData.password = data.password;
            }
            updateUser.mutate(
                { id: editingUser.id, data: updateData },
                { onSuccess: () => setEditingUser(null) }
            );
        }
    };

    const handleDeleteConfirm = () => {
        if (deletingUser) {
            deleteUser.mutate(deletingUser.id, {
                onSuccess: () => setDeletingUser(null),
            });
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
                            <p className="text-sm text-muted-foreground">Kelola admin dan editor website.</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="gap-2">
                        <UserPlus className="w-4 h-4" />
                        Tambah Pengguna
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau email..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Pengguna</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Terdaftar</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                        <p className="mt-2 text-sm text-muted-foreground">Memuat data pengguna...</p>
                                    </TableCell>
                                </TableRow>
                            ) : users?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center">
                                        <p className="text-muted-foreground">Tidak ada pengguna ditemukan.</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users?.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.role === 'ADMIN' ? (
                                                <Badge className="gap-1 bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    Admin
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="gap-1">
                                                    <Shield className="w-3 h-3" />
                                                    Editor
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={user.isActive}
                                                    onCheckedChange={(checked) =>
                                                        toggleStatus.mutate({ id: user.id, isActive: checked })
                                                    }
                                                    disabled={toggleStatus.isPending}
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {user.isActive ? 'Aktif' : 'Non-aktif'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: id })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingUser(user)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setDeletingUser(user)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Add User Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                            <DialogDescription>
                                Buat akun baru untuk admin atau editor website.
                            </DialogDescription>
                        </DialogHeader>
                        <UserForm
                            onSubmit={handleCreateSubmit}
                            isLoading={createUser.isPending}
                        />
                    </DialogContent>
                </Dialog>

                {/* Edit User Dialog */}
                <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Pengguna</DialogTitle>
                            <DialogDescription>
                                Ubah informasi profil atau role pengguna.
                            </DialogDescription>
                        </DialogHeader>
                        {editingUser && (
                            <UserForm
                                user={editingUser}
                                onSubmit={handleUpdateSubmit}
                                isLoading={updateUser.isPending}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Akun <strong>{deletingUser?.name}</strong> akan dihapus permanen.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteConfirm}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {deleteUser.isPending ? 'Menghapus...' : 'Ya, Hapus'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
};
