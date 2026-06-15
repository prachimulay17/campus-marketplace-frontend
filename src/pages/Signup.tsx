import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterFormData } from '@/types';
import api, { endpoints } from '@/lib/api';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"register" | "verify">("register");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    college: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const { register, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if user becomes authenticated (e.g., from another tab)
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/browse', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const validateRegister = (): boolean => {
    const errs: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.college.trim()) {
      errs.college = 'College name is required';
    } else if (formData.college.trim().length < 2) {
      errs.college = 'College name must be at least 2 characters';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const clearFieldError = (field: keyof RegisterFormData) => {
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateRegister()) return;

    setLoading(true);
    try {
      const res = await api.post(endpoints.otp.send, { email: formData.email });
      if (res.status === 200) {
        setStep("verify");
        setResendDisabled(true);
        setTimeout(() => setResendDisabled(false), 30000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post(endpoints.otp.verify, {
        email: formData.email,
        otp
      });

      if (res.status === 200) {
        // Now register the user with full form data
        await register(formData);
        // Navigation is handled by AuthContext
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post(endpoints.otp.send, { email: formData.email });
      if (res.status === 200) {
        setResendDisabled(true);
        setTimeout(() => setResendDisabled(false), 30000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
    clearFieldError(id as keyof RegisterFormData);
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
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Create an account</h1>
              <p className="text-muted-foreground">Join your campus marketplace today</p>
            </div>

            {step === "register" && (
              <div className="transition-opacity duration-300">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      minLength={2}
                      maxLength={50}
                      className={fieldErrors.name ? 'border-destructive' : ''}
                    />
                    {fieldErrors.name && (
                      <p className="text-sm text-destructive">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@university.edu"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className={fieldErrors.email ? 'border-destructive' : ''}
                    />
                    {fieldErrors.email && (
                      <p className="text-sm text-destructive">{fieldErrors.email}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Use your university email for verification</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="college">College/University</Label>
                    <Input
                      id="college"
                      type="text"
                      placeholder="State University"
                      value={formData.college}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      minLength={2}
                      maxLength={100}
                      className={fieldErrors.college ? 'border-destructive' : ''}
                    />
                    {fieldErrors.college && (
                      <p className="text-sm text-destructive">{fieldErrors.college}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
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

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                  {error && (
                    <p className="text-sm text-destructive text-center mt-4">{error}</p>
                  )}
                </form>
              </div>
            )}

            {step === "verify" && (
              <div className="transition-opacity duration-300 space-y-5">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Verify your Email</h2>
                  <p className="text-muted-foreground">We sent a 6-digit code to {formData.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    disabled={loading}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                <Button onClick={handleVerifyOtp} className="w-full" size="lg" disabled={loading || otp.length !== 6}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Create Account'
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || resendDisabled}
                    className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:cursor-not-allowed"
                  >
                    {resendDisabled ? 'Resend OTP in 30s' : 'Resend OTP'}
                  </button>
                </div>

                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
