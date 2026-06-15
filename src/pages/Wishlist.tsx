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
        <div className="container py-16 text-center">
          <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-6">
            Please login to view your wishlist
          </p>
          <Button asChild variant="hero">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your wishlist...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Failed to load wishlist</h1>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </Layout>
    );
  }

  const { items, pagination } = wishlistResponse || { items: [], pagination: null };

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <Heart className="h-6 w-6 text-red-400 fill-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">My Wishlist</h1>
            <p className="text-gray-400">
              {pagination?.totalItems === 0 
                ? 'No items in your wishlist yet'
                : `${pagination?.totalItems} item${pagination?.totalItems === 1 ? '' : 's'} saved`
              }
            </p>
          </div>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass rounded-2xl p-12 max-w-md mx-auto">
              <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
              <p className="text-gray-400 mb-6">
                Start browsing items and click the heart icon to save them here!
              </p>
              <Button asChild variant="hero">
                <Link to="/browse">Browse Items</Link>
              </Button>
            </div>
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
                  className="border-purple-500/30 hover:bg-purple-500/10"
                >
                  Previous
                </Button>
                
                <span className="text-sm text-gray-400 px-4">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  disabled={!pagination.hasNextPage || isLoading}
                  onClick={() => setPage(page + 1)}
                  className="border-purple-500/30 hover:bg-purple-500/10"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;