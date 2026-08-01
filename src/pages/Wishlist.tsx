import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import ItemCard from '@/components/ItemCard';
import { useQuery } from '@tanstack/react-query';
import api, { endpoints } from '@/lib/api';
import { ItemsListResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);

  const {
    data: wishlistResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['wishlist', page],
    queryFn: async () => {
      const response = await api.get<{ data: ItemsListResponse }>(endpoints.items.getWishlist, {
        params: { page, limit: 12 }
      });
      return response.data.data;
    },
    enabled: isAuthenticated,
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="editorial-bg">
          <div className="container py-16 text-center">
            <div className="story-note p-12 max-w-md mx-auto">
              <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h1 className="editorial-serif text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
              <p className="text-gray-600 mb-6">
                Please login to view your wishlist
              </p>
              <Button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="editorial-bg">
          <div className="container py-16 flex items-center justify-center">
            <div className="story-note p-8 flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <p className="text-sm text-gray-600">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="editorial-bg">
          <div className="container py-16 text-center">
            <div className="story-note p-12 max-w-md mx-auto">
              <h1 className="editorial-serif text-2xl font-bold text-gray-900 mb-4">Failed to load wishlist</h1>
              <p className="text-gray-600 mb-6">
                {error instanceof Error ? error.message : 'Something went wrong'}
              </p>
              <Button 
                onClick={() => refetch()}
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const { items, pagination } = wishlistResponse || { items: [], pagination: null };

  return (
    <Layout>
      <div className="editorial-bg">
        <div className="container py-6 md:py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-300">
              <Heart className="h-6 w-6 text-orange-600 fill-orange-600" />
            </div>
            <div>
              <h1 className="editorial-serif text-3xl md:text-4xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 text-sm">
                {pagination?.totalItems === 0 
                  ? 'No items in your wishlist yet'
                  : `${pagination?.totalItems} item${pagination?.totalItems === 1 ? '' : 's'} saved`
                }
              </p>
            </div>
          </div>

          {/* Empty state */}
          {items.length === 0 ? (
            <div className="campus-empty-state">
              <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="campus-empty-title">Your wishlist is empty</h3>
              <p className="campus-empty-subtitle">
                Start browsing items and click the heart icon to save them here!
              </p>
              <Button className="mt-6 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200">
                <Link to="/browse">Browse Items</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {items.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrevPage || isLoading}
                    onClick={() => setPage(page - 1)}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 bg-white"
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-600 px-4">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNextPage || isLoading}
                    onClick={() => setPage(page + 1)}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 bg-white"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;