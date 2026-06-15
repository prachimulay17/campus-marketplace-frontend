import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, ArrowLeft, Loader2, Mail, CheckCircle } from 'lucide-react';
import api, { endpoints } from '@/lib/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const response = await api.post(endpoints.auth.forgotPassword, { email: email.toLowerCase() });
      
      if (response.data.success) {
        setSuccess(true);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
    if (error) {
      setError('');
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
            {!success ? (
              <>
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Forgot password?</h1>
                  <p className="text-muted-foreground">Enter your email address and we'll send you a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@university.edu"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      disabled={loading}
                      className={emailError ? 'border-destructive' : ''}
                    />
                    {emailError && (
                      <p className="text-sm text-destructive">{emailError}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading || !email.trim()}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </Button>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <p className="text-sm text-destructive text-center">{error}</p>
                    </div>
                  )}
                </form>

                <div className="text-center mt-6">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
                <p className="text-muted-foreground mb-6">
                  If an account with <strong>{email}</strong> exists, we've sent you a password reset link.
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link to="/login">Back to login</Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    size="sm"
                    onClick={() => {
                      setSuccess(false);
                      setEmail('');
                      setError('');
                    }}
                  >
                    Try different email
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;