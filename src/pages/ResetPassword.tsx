import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api, { endpoints } from '@/lib/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/browse', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const validatePasswords = (): boolean => {
    const errors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePasswords()) return;

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(endpoints.auth.resetPassword.replace(':token', token), {
        password,
      });

      if (response.data.success) {
        // Store the new token from successful reset
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        navigate('/browse', { 
          replace: true,
          state: { message: 'Password reset successfully! You are now logged in.' }
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      
      if (errorMessage.includes('invalid') || errorMessage.includes('expired')) {
        setError('This reset link is invalid or has expired. Please request a new one.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: 'password' | 'confirmPassword') => {
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (error) {
      setError('');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
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

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Reset Link</h1>
              <p className="text-muted-foreground mb-6">
                This password reset link is invalid or malformed. Please request a new one.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/forgot-password">Request new reset link</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Back to login</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <KeyRound className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Reset your password</h1>
              <p className="text-muted-foreground">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError('password');
                    }}
                    required
                    disabled={loading}
                    minLength={6}
                    className={fieldErrors.password ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-sm text-destructive">{fieldErrors.password}</p>
                )}
                <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError('confirmPassword');
                    }}
                    required
                    disabled={loading}
                    minLength={6}
                    className={fieldErrors.confirmPassword ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={loading || !password || !confirmPassword}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset password'
                )}
              </Button>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm text-destructive text-center">{error}</p>
                  {error.includes('invalid') || error.includes('expired') ? (
                    <div className="text-center mt-3">
                      <Link 
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Request a new reset link
                      </Link>
                    </div>
                  ) : null}
                </div>
              )}
            </form>

            <div className="text-center mt-6">
              <Link 
                to="/login" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;