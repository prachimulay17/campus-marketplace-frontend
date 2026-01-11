import { Link, useNavigate } from 'react-router-dom';
import { Settings, Plus, Edit, Trash2, MapPin, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Layout from '@/components/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import api, { endpoints } from '@/lib/api';
import { Category, Condition, ItemsListResponse, ApiResponse, User } from '@/types';
import { toast } from 'sonner';

const getCategoryVariant = (category: Category) => {
  const variants: Record<Category, 'default' | 'secondary'> = {
    Books: 'default',
    Electronics: 'secondary',
    Furniture: 'default',
    Clothing: 'secondary',
    Others: 'default',
  };
  return variants[category];
};

const getConditionVariant = (condition: Condition) => {
  const variants: Record<Condition, 'default' | 'secondary'> = {
    'New': 'secondary',
    'Like New': 'default',
    'Used': 'default',
    'Poor': 'secondary',
  };
  return variants[condition];
};

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user's items
  const {
    data: itemsResponse,
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ['userItems'],
    queryFn: async () => {
      const response = await api.get<{ data: ItemsListResponse }>(endpoints.items.getMyItems);
      return response.data.data;
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await api.delete(endpoints.items.delete(itemId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userItems'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete item');
    },
  });

  const userItems = itemsResponse?.items || [];

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Please log in to view your profile</p>
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
        {/* Profile Header */}
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-foreground mb-1">{user.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <MapPin className="h-4 w-4" />
                  {user.college}
                </div>
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Button variant="outline" size="sm" onClick={() => navigate('/profile/edit')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* User's Listings */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Your Listings</h2>
            <p className="text-sm text-muted-foreground">
              {itemsLoading ? 'Loading...' : `${userItems.length} item${userItems.length !== 1 ? 's' : ''} listed`}
            </p>
          </div>
          <Button asChild>
            <Link to="/post">
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {itemsLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span className="text-muted-foreground">Loading your items...</span>
          </div>
        )}

        {/* Error State */}
        {itemsError && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-2">Failed to load your items</p>
            <p className="text-sm text-muted-foreground mb-4">
              {itemsError instanceof Error ? itemsError.message : 'Something went wrong'}
            </p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['userItems'] })} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Items List */}
        {!itemsLoading && !itemsError && userItems.length > 0 && (
          <div className="grid gap-4">
            {userItems.map((item) => (
              <div
                key={item._id}
                className="bg-card rounded-xl shadow-card p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                <div className="w-full sm:w-32 aspect-[4/3] sm:aspect-square rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getCategoryVariant(item.category)}>
                          {capitalizeFirst(item.category)}
                        </Badge>
                        <Badge variant={getConditionVariant(item.condition)}>
                          {capitalizeFirst(item.condition)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-1">{item.title}</h3>
                      <p className="text-lg font-bold text-primary mt-1">${item.price}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => navigate(`/item/${item._id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this item?')) {
                            deleteItemMutation.mutate(item._id);
                          }
                        }}
                        disabled={deleteItemMutation.isPending}
                      >
                        {deleteItemMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-muted-foreground">
                      Posted on {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <Badge variant={item.isSold ? 'secondary' : 'default'} className="text-xs">
                      {item.isSold ? 'Sold' : 'Available'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!itemsLoading && !itemsError && userItems.length === 0 && (
          <div className="text-center py-16 bg-card rounded-2xl">
            <p className="text-lg text-muted-foreground mb-4">You haven't listed any items yet</p>
            <Button asChild>
              <Link to="/post">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Item
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
