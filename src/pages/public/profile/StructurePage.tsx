import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Member {
    name: string;
    role: string;
    image?: string;
    bio?: string;
}

const leadership: Member[] = [
    {
        name: "Dr. H. Ahmad Dahlan",
        role: "Ketua Umum",
        image: "/placeholder-user.jpg",
        bio: "Visioner dan penggerak utama organisasi."
    },
    {
        name: "H. Mas Mansur",
        role: "Sekretaris Umum",
        image: "/placeholder-user.jpg",
        bio: "Ahli strategi dan administrasi organisasi."
    },
    {
        name: "H. Ki Bagus Hadikusumo",
        role: "Bendahara Umum",
        image: "/placeholder-user.jpg",
        bio: "Pengelola keuangan yang amanah dan transparan."
    }
];

const councils: Member[] = [
    {
        name: "H. Fachrodin",
        role: "Majelis Tarjih",
        image: "/placeholder-user.jpg",
    },
    {
        name: "H. Sudja'",
        role: "Majelis PKU",
        image: "/placeholder-user.jpg",
    },
    {
        name: "H. Hisyam",
        role: "Majelis Pustaka",
        image: "/placeholder-user.jpg",
    },
    {
        name: "H. Ibrohim",
        role: "Majelis Tabligh",
        image: "/placeholder-user.jpg",
    }
];


export function StructurePage() {
    return (
        <div className="container mx-auto px-4 py-12 space-y-16">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-primary">
                    Struktur Organisasi
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Susunan kepengurusan periode 2022-2027 yang amanah dalam menjalankan roda organisasi.
                </p>
            </div>

            {/* Leadership Section */}
            <section className="space-y-8">
                <div className="text-center">
                    <Badge variant="outline" className="text-lg py-1 px-4 mb-4 border-primary text-primary">Pimpinan Harian</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
                    {leadership.map((member, index) => (
                        <Card key={index} className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-primary">
                            <CardHeader className="pb-2">
                                <div className="mx-auto mb-4">
                                    <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                                        <AvatarImage src={member.image} alt={member.name} />
                                        <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                            {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
                                <p className="text-primary font-medium">{member.role}</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground italic">
                                    "{member.bio}"
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Councils Section */}
            <section className="space-y-8 pt-8">
                <div className="text-center">
                    <Badge variant="outline" className="text-lg py-1 px-4 mb-4 border-primary text-primary">Majelis & Lembaga</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {councils.map((member, index) => (
                        <Card key={index} className="text-center hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="mx-auto mb-2">
                                    <Avatar className="w-20 h-20 border-2 border-muted">
                                        <AvatarImage src={member.image} alt={member.name} />
                                        <AvatarFallback className="bg-muted text-muted-foreground">
                                            {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle className="text-lg font-semibold">{member.name}</CardTitle>
                                <p className="text-sm text-primary font-medium">{member.role}</p>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
