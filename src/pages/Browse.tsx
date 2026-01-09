import React, { useState, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';
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
    { id: 'all', label: 'All Items' },
    { id: 'Books', label: 'Books' },
    { id: 'Electronics', label: 'Electronics' },
    { id: 'Furniture', label: 'Furniture' },
    { id: 'Clothing', label: 'Clothing' },
    { id: 'Others', label: 'Others' },
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
      const response = await api.get<ItemsListResponse>(endpoints.items.list, {
        params: queryParams,
      });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const items = itemsResponse?.items || [];
  const pagination = itemsResponse?.pagination;

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Browse Items</h1>
          <p className="text-muted-foreground">Find great deals from students on campus</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for books, electronics, furniture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12"
          />
        </div>

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as Category | 'all')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span className="text-muted-foreground">Loading items...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-2">Failed to load items</p>
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <p className="text-sm text-muted-foreground mb-4">
            {pagination?.totalItems || 0} item{(pagination?.totalItems || 0) !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Items Grid */}
        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-2">No items found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Browse;
