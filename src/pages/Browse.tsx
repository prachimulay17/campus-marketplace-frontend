import React, { useState } from 'react';
import { Search, Loader2, MapPin, Clock, Users } from 'lucide-react';
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

  // Campus-themed categories
  const categories = [
    { id: 'all', label: 'All Around Campus', emoji: '🏛️' },
    { id: 'Books', label: 'Library Finds', emoji: '📚' },
    { id: 'Electronics', label: 'Tech Corner', emoji: '💻' },
    { id: 'Furniture', label: 'Dorm Setup', emoji: '🪑' },
    { id: 'Clothing', label: 'Campus Style', emoji: '👕' },
    { id: 'Others', label: 'Random Finds', emoji: '🎒' },
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

  // Helper function to get time ago
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get recent items (posted within last 24 hours)
  const recentItems = items.filter(item => {
    const hoursAgo = Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60));
    return hoursAgo < 24;
  });

  // Get items from specific locations/colleges
  const nearbyItems = items.filter(item => 
    item.seller.college && item.seller.college.toLowerCase().includes('hostel')
  );

  return (
    <Layout>
      <div className="campus-marketplace">
        <div className="container py-6 md:py-8 max-w-7xl relative">
          {/* Explore Campus Header */}
          <div className="campus-section-header text-center mb-8">
            <h1 className="campus-section-title text-3xl md:text-4xl mb-3">
              Explore Campus
            </h1>
            <p className="campus-section-subtitle text-lg max-w-2xl mx-auto">
              Discover amazing finds from students around your campus. From textbooks to tech gear, 
              everything you need is right here in your community.
            </p>
          </div>

          {/* Campus Search */}
          <div className="campus-search-area max-w-2xl mx-auto">
            <div className="flex items-center px-4 py-3">
              <Search className="h-5 w-5 text-gray-400 flex-shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Search for books, laptops, furniture around campus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="campus-search-input"
              />
            </div>
          </div>

          {/* Campus Category Navigation */}
          <div className="campus-category-tabs justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as Category | 'all')}
                className={cn(
                  "campus-category-tab",
                  activeCategory === category.id && "active"
                )}
              >
                <span>{category.emoji}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          {/* Campus Stats Bar */}
          {!isLoading && !error && (
            <div className="campus-stats-bar">
              <div className="campus-stats-content">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">
                      <strong>{pagination?.totalItems || 0}</strong> items available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">
                      Active student marketplace
                    </span>
                  </div>
                </div>
                {activeCategory !== 'all' && (
                  <div className="text-sm text-gray-600">
                    Browsing: <span className="font-semibold text-purple-700">
                      {categories.find(c => c.id === activeCategory)?.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 animate-pulse">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
              <span className="text-gray-600">Exploring campus listings...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="campus-empty-state max-w-md mx-auto">
              <div className="campus-empty-icon">😕</div>
              <div className="campus-empty-title">Unable to load campus listings</div>
              <p className="campus-empty-subtitle mb-4">
                {error instanceof Error ? error.message : 'Something went wrong while exploring campus'}
              </p>
              <button
                onClick={() => refetch()}
                className="campus-category-tab active"
              >
                Try exploring again
              </button>
            </div>
          )}

          {/* Fresh Around Campus - Recent Items */}
          {!isLoading && !error && recentItems.length > 0 && (
            <div className="mb-12">
              <div className="campus-section-header">
                <h2 className="campus-section-title flex items-center gap-2">
                  <Clock className="w-6 h-6 text-purple-600" />
                  Fresh Around Campus
                </h2>
                <p className="campus-section-subtitle">
                  Just posted by your fellow students - catch these while they're hot!
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recentItems.slice(0, 8).map((item) => (
                  <ItemCard key={`recent-${item._id}`} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Near Your Hostel */}
          {!isLoading && !error && nearbyItems.length > 0 && (
            <div className="mb-12">
              <div className="campus-section-header">
                <h2 className="campus-section-title flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-green-600" />
                  Near Your Hostel
                </h2>
                <p className="campus-section-subtitle">
                  Items available from students in nearby hostels and dorms
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {nearbyItems.slice(0, 4).map((item) => (
                  <ItemCard key={`nearby-${item._id}`} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* All Campus Listings */}
          {!isLoading && !error && items.length > 0 && (
            <div>
              <div className="campus-section-header">
                <h2 className="campus-section-title">
                  {activeCategory === 'all' ? 'All Campus Listings' : `${categories.find(c => c.id === activeCategory)?.label} Around Campus`}
                </h2>
                <p className="campus-section-subtitle">
                  {activeCategory === 'all' 
                    ? 'Browse everything available from students across campus'
                    : `Find the best ${categories.find(c => c.id === activeCategory)?.label?.toLowerCase()} from your campus community`
                  }
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && items.length === 0 && (
            <div className="campus-empty-state max-w-md mx-auto">
              <div className="campus-empty-icon">🔍</div>
              <div className="campus-empty-title">
                {debouncedSearch ? 'No items found' : 'No items in this area'}
              </div>
              <div className="campus-empty-subtitle">
                {debouncedSearch 
                  ? `No items found for "${debouncedSearch}". Try adjusting your search or exploring different categories.`
                  : 'Be the first to post something in this category! Your fellow students are waiting.'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Browse;
