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
        <div className="editorial-bg">
          <div className="container py-16 flex items-center justify-center">
            <div className="story-note p-8 text-center">
              <p className="text-gray-600 mb-4">Please log in to view your profile</p>
              <Button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium">
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="editorial-bg">
        <div className="container py-6 md:py-8">
          {/* Profile Header */}
          <div className="story-note p-6 md:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-orange-100">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="editorial-serif text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1 justify-center sm:justify-start text-sm">
                    <MapPin className="h-4 w-4" />
                    {user.college}
                  </div>
                  <div className="flex items-center gap-1 justify-center sm:justify-start text-sm">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <Button 
                    onClick={() => navigate('/profile/edit')}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 bg-white font-medium text-sm"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    onClick={() => navigate('/change-password')}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 bg-white font-medium text-sm"
                    size="sm"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* User's Listings */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="editorial-serif text-2xl font-bold text-gray-900">Your Listings</h2>
              <p className="text-sm text-gray-600">
                {itemsLoading ? 'Loading...' : `${userItems.length} item${userItems.length !== 1 ? 's' : ''} listed`}
              </p>
            </div>
            <Button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium">
              <Link to="/post" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Listing
              </Link>
            </Button>
          </div>

          {/* Loading State */}
          {itemsLoading && (
            <div className="story-note p-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500 mr-2" />
              <span className="text-gray-600">Loading your items...</span>
            </div>
          )}

          {/* Error State */}
          {itemsError && (
            <div className="story-note p-8 text-center">
              <p className="text-lg text-gray-600 mb-2">Failed to load your items</p>
              <p className="text-sm text-gray-500 mb-4">
                {itemsError instanceof Error ? itemsError.message : 'Something went wrong'}
              </p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['userItems'] })} 
                className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 bg-white"
              >
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
                  className="story-note p-4 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="w-full sm:w-32 aspect-[4/3] sm:aspect-square rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.images[0]} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getCategoryVariant(item.category)} className="text-xs">
                            {capitalizeFirst(item.category)}
                          </Badge>
                          <Badge variant={getConditionVariant(item.condition)} className="text-xs">
                            {capitalizeFirst(item.condition)}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{item.title}</h3>
                        <p className="text-lg font-bold text-orange-600 mb-2">₹{item.price}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 hover:bg-gray-100"
                          onClick={() => navigate(`/item/${item._id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
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

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-500">
                        Posted on {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <Badge 
                        variant={item.isSold ? 'secondary' : 'default'} 
                        className={`text-xs ${item.isSold ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}
                      >
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
            <div className="campus-empty-state">
              <div className="campus-empty-icon">📦</div>
              <p className="campus-empty-title">You haven't listed any items yet</p>
              <Button className="mt-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium">
                <Link to="/post" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Post Your First Item
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
