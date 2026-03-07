import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api, { endpoints } from '@/lib/api';

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || !token) return;

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post(endpoints.auth.resetPassword(token), { password });
            if (res.data.success) {
                toast.success(res.data.message || 'Password reset successful');
                // Store the returned token the same way as login to auto-authenticate them
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    // Wait a brief moment to show toast then redirect
                    setTimeout(() => navigate('/browse'), 1000);
                } else {
                    navigate('/login');
                }
            }
        } catch (error: any) {
            const backendMessage = error.response?.data?.message || 'Failed to reset password';
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
                            <h1 className="text-2xl font-bold text-foreground mb-2">Create new password</h1>
                            <p className="text-muted-foreground">It must be at least 6 characters long.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Re-enter new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;
