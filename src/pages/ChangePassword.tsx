import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Eye, EyeOff, Loader2, Shield, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import api, { endpoints } from '@/lib/api';
import { toast } from 'sonner';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const { user } = useAuth();
  const navigate = useNavigate();

  const validatePasswords = (): boolean => {
    const errors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    } else if (newPassword === currentPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePasswords()) return;

    setLoading(true);
    try {
      const response = await api.patch(endpoints.auth.changePassword, {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        setSuccess(true);
        toast.success('Password changed successfully');
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to change password. Please try again.';
      
      if (errorMessage.includes('current password') || errorMessage.includes('incorrect')) {
        setFieldErrors({ currentPassword: 'Current password is incorrect' });
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (error) {
      setError('');
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError('');
    setFieldErrors({});
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Please log in to change your password</p>
            <Button asChild className="mt-4">
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6 md:py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/profile" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Change Password</h1>
              <p className="text-muted-foreground">Update your account password</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      clearFieldError('currentPassword');
                    }}
                    required
                    disabled={loading}
                    className={fieldErrors.currentPassword ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={loading}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.currentPassword && (
                  <p className="text-sm text-destructive">{fieldErrors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      clearFieldError('newPassword');
                    }}
                    required
                    disabled={loading}
                    minLength={6}
                    className={fieldErrors.newPassword ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={loading}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.newPassword && (
                  <p className="text-sm text-destructive">{fieldErrors.newPassword}</p>
                )}
                <p className="text-xs text-muted-foreground">Must be at least 6 characters and different from current password</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
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

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm text-destructive text-center">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  size="lg"
                  disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing password...
                    </>
                  ) : (
                    'Change password'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/profile')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Password changed!</h2>
              <p className="text-muted-foreground mb-6">
                Your password has been updated successfully. You'll be redirected to your profile in a few seconds.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/profile">Go to Profile</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full sm:w-auto ml-0 sm:ml-3"
                  onClick={resetForm}
                >
                  Change password again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChangePassword;