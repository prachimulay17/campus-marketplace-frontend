import React, { useState } from 'react';
import { Search, Loader2, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import ItemCard from '@/components/ItemCard';
import { useQuery } from '@tanstack/react-query';
import api, { endpoints } from '@/lib/api';
import { ItemsListResponse, ItemsQueryParams, Category } from '@/types';
import { cn } from '@/lib/utils';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Categories matching backend enum
  const categories = [
    { id: 'all', label: 'All Items', emoji: '✨' },
    { id: 'Books', label: 'Books', emoji: '📚' },
    { id: 'Electronics', label: 'Electronics', emoji: '💻' },
    { id: 'Furniture', label: 'Furniture', emoji: '🪑' },
    { id: 'Clothing', label: 'Clothing', emoji: '👕' },
    { id: 'Others', label: 'Others', emoji: '📦' },
  ] as const;

  // Build query parameters
  const queryParams: ItemsQueryParams = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(activeCategory !== 'all' && { category: activeCategory }),
  };

  // Fetch items from API
  const {
    data: itemsResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['items', queryParams],
    queryFn: async () => {
      const response = await api.get<{ data: ItemsListResponse }>(endpoints.items.list, {
        params: queryParams,
      });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const items = itemsResponse?.items || [];
  const pagination = itemsResponse?.pagination;

  return (
    <Layout>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-background to-background pointer-events-none" />

        <div className="container relative py-8 md:py-12">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Explore <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="text-gray-400">Find great deals from students on campus</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative glass rounded-2xl overflow-hidden group hover:border-purple-500/30 transition-all">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="Search for books, electronics, furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mb-8 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as Category | 'all')}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2",
                    activeCategory === category.id
                      ? "gradient-btn shadow-purple-sm"
                      : "glass text-gray-400 hover:text-white hover:bg-purple-500/10"
                  )}
                >
                  <span>{category.emoji}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 animate-pulse">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
              <span className="text-gray-400">Loading items...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20 glass rounded-2xl max-w-md mx-auto">
              <p className="text-lg text-white mb-2">Failed to load items</p>
              <p className="text-sm text-gray-400 mb-6">
                {error instanceof Error ? error.message : 'Something went wrong'}
              </p>
              <button
                onClick={() => refetch()}
                className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold"
              >
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* Results Count */}
          {!isLoading && !error && (
            <p className="text-sm text-gray-500 mb-6">
              {pagination?.totalItems || 0} item{(pagination?.totalItems || 0) !== 1 ? 's' : ''} found
            </p>
          )}

          {/* Items Grid */}
          {!isLoading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && items.length === 0 && (
            <div className="text-center py-20 glass rounded-2xl max-w-md mx-auto">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg text-white mb-2">No items found</p>
              <p className="text-sm text-gray-400">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Browse;
