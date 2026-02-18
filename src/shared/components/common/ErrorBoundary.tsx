import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    private handleGoHome = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const isDev = import.meta.env.DEV;

            return (
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-2xl shadow-xl border border-border/50 backdrop-blur-sm">
                        <div className="flex justify-center">
                            <div className="p-4 bg-destructive/10 rounded-full">
                                <AlertCircle className="w-12 h-12 text-destructive" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Oops, terjadi kesalahan</h2>
                            <p className="text-muted-foreground">
                                Aplikasi mengalami kendala teknis. Jangan khawatir, Anda bisa mencoba memuat ulang halaman.
                            </p>
                            {isDev && (
                                <div className="mt-4 p-4 bg-muted rounded-lg text-left overflow-auto max-h-32 text-xs font-mono">
                                    {this.state.error?.toString()}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <Button
                                onClick={this.handleRetry}
                                className="gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Muat Ulang
                            </Button>
                            <Button
                                variant="outline"
                                onClick={this.handleGoHome}
                                className="gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Kembali ke Beranda
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
