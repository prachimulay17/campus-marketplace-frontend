import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '@/lib/api';
import { UpdateProfileFormData, ApiResponse, User } from '@/types';
import { toast } from 'sonner';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateProfileFormData>({
    name: user?.name || '',
    college: user?.college || '',
    avatar: user?.avatar || '',
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileFormData) => {
      const response = await api.patch<ApiResponse<{ user: User }>>(endpoints.auth.updateProfile, data);
      return response.data.data!.user;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
      toast.success('Profile updated successfully!');
      navigate('/profile');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.college.trim()) {
      toast.error('College is required');
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Please log in to edit your profile</p>
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
      <div className="container py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Edit Profile</h1>
            <p className="text-muted-foreground">Update your profile information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.avatar} alt={user.name} />
                <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">
                  Profile picture will be updated when you save changes
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={50}
                disabled={updateProfileMutation.isPending}
              />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            {/* College */}
            <div className="space-y-2">
              <Label htmlFor="college">College/University</Label>
              <Input
                id="college"
                type="text"
                placeholder="State University"
                value={formData.college}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                disabled={updateProfileMutation.isPending}
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL (Optional)</Label>
              <Input
                id="avatar"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar}
                onChange={handleChange}
                disabled={updateProfileMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Provide a URL to an image for your profile picture
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="hero"
                disabled={updateProfileMutation.isPending}
                className="flex-1"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
                disabled={updateProfileMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;
