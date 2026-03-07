import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api, { endpoints } from '@/lib/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const res = await api.post(endpoints.auth.forgotPassword, { email });
            if (res.data.success) {
                setIsSent(true);
                toast.success(res.data.message || 'Reset link sent to your email.');
            }
        } catch (error: any) {
            const backendMessage = error.response?.data?.message || 'Failed to send reset email';
            toast.error(backendMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container h-16 flex items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">CampusMarket</span>
                    </Link>
                </div>
            </header>

            {/* Form */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-foreground mb-2">Reset your password</h1>
                            <p className="text-muted-foreground">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {isSent ? (
                            <div className="space-y-6">
                                <div className="bg-primary/10 text-primary p-4 rounded-lg text-center text-sm font-medium">
                                    Check your email for the reset link!
                                </div>
                                <Button asChild className="w-full">
                                    <Link to="/login">Return to login</Link>
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@university.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Link...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </Button>

                                <div className="text-center mt-4">
                                    <Link to="/login" className="text-sm text-primary hover:underline">
                                        Back to login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;
