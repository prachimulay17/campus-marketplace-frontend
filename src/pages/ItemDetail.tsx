import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, MapPin, Calendar, Loader2, Heart, User, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { createConversation } from '@/services/chat.service';
import { Category, Condition, Item } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const getCategoryColor = (category: Category) => {
  const colors: Record<Category, string> = {
    Books: 'bg-blue-100 text-blue-800 border-blue-200',
    Electronics: 'bg-purple-100 text-purple-800 border-purple-200',
    Furniture: 'bg-green-100 text-green-800 border-green-200',
    Clothing: 'bg-pink-100 text-pink-800 border-pink-200',
    Others: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[category];
};

const getConditionColor = (condition: Condition) => {
  const colors: Record<Condition, string> = {
    'New': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Like New': 'bg-teal-100 text-teal-800 border-teal-200',
    'Used': 'bg-amber-100 text-amber-800 border-amber-200',
    'Poor': 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[condition];
};

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const {
    data: itemResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const response = await api.get<{ data: { item: Item } }>(endpoints.items.getById(id!));
      return response.data.data.item;
    },
    enabled: !!id,
  });

  const item = itemResponse;

  // Sync local state with server data whenever item data changes
  useEffect(() => {
    if (item) {
      setIsWishlisted(item.isWishlisted || false);
    }
  }, [item?.isWishlisted]);

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(endpoints.items.toggleWishlist(id!));
      return response.data;
    },
    onSuccess: (data) => {
      setIsWishlisted(data.data.isWishlisted);
      
      queryClient.setQueryData(['item', id], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            isWishlisted: data.data.isWishlisted,
            wishlistCount: data.data.wishlistCount
          };
        }
        return oldData;
      });

      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      
      toast({
        title: data.data.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
        description: data.data.isWishlisted 
          ? 'Item saved to your wishlist' 
          : 'Item removed from your wishlist',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update wishlist',
        variant: 'destructive',
      });
    },
  });

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to add items to your wishlist',
        variant: 'destructive',
      });
      return;
    }

    if (user?._id === item?.seller._id) {
      toast({
        title: 'Cannot wishlist own item',
        description: 'You cannot add your own items to wishlist',
        variant: 'destructive',
      });
      return;
    }

    wishlistMutation.mutate();
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (item && item.images.length > 1) {
      if (isLeftSwipe && activeImageIndex < item.images.length - 1) {
        setActiveImageIndex(activeImageIndex + 1);
      }
      if (isRightSwipe && activeImageIndex > 0) {
        setActiveImageIndex(activeImageIndex - 1);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item || item.images.length <= 1) return;
      
      if (e.key === 'ArrowLeft' && activeImageIndex > 0) {
        setActiveImageIndex(activeImageIndex - 1);
      }
      if (e.key === 'ArrowRight' && activeImageIndex < item.images.length - 1) {
        setActiveImageIndex(activeImageIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, item]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="item-detail-page">
          <div className="container py-16 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-gray-600">Loading item details...</p>
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
        <div className="item-detail-page">
          <div className="container py-16 text-center">
            <h1 className="item-detail-title mb-4">Unable to load item</h1>
            <p className="text-gray-600 mb-6">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
            <Link to="/browse" className="item-detail-button item-detail-button-primary">
              Back to Browse
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Not found state
  if (!item) {
    return (
      <Layout>
        <div className="item-detail-page">
          <div className="container py-16 text-center">
            <h1 className="item-detail-title mb-4">Item not found</h1>
            <Link to="/browse" className="item-detail-button item-detail-button-primary">
              Back to Browse
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="item-detail-page">
        <div className="item-detail-container">
          {/* Back Button */}
          <Link to="/browse" className="back-link">
            <ArrowLeft className="h-4 w-4" />
            Back to Campus Marketplace
          </Link>

          {/* Single Polaroid Gallery */}
          <div className="polaroid-gallery">
            {item.images.length === 1 ? (
              // Single Polaroid
              <div className="polaroid-single">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="polaroid-image"
                />
                <div className="polaroid-caption">{item.title}</div>
              </div>
            ) : (
              // Multiple Images with Navigation
              <div className="polaroid-navigation">
                <button
                  className="polaroid-nav-button prev"
                  onClick={() => setActiveImageIndex(Math.max(0, activeImageIndex - 1))}
                  disabled={activeImageIndex === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div 
                  className="polaroid-multiple"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={item.images[activeImageIndex]}
                    alt={`${item.title} ${activeImageIndex + 1}`}
                    className="polaroid-image"
                  />
                  <div className="polaroid-caption">
                    {activeImageIndex === 0 ? item.title : `Photo ${activeImageIndex + 1}`}
                  </div>
                  <div className="polaroid-counter">
                    {activeImageIndex + 1} / {item.images.length}
                  </div>
                </div>

                <button
                  className="polaroid-nav-button next"
                  onClick={() => setActiveImageIndex(Math.min(item.images.length - 1, activeImageIndex + 1))}
                  disabled={activeImageIndex === item.images.length - 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Editorial Content - Single Column */}
          <div className="item-detail-content">
            <div className="item-detail-inner">
              {/* Title */}
              <h1 className="item-detail-title">{item.title}</h1>

              {/* Price */}
              <div className="item-detail-price">₹{item.price.toLocaleString()}</div>

              {/* Category and Condition Badges */}
              <div className="item-detail-badges">
                <span className={`item-detail-badge ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                <span className={`item-detail-badge ${getConditionColor(item.condition)}`}>
                  {item.condition}
                </span>
              </div>

              {/* About Item */}
              <div className="item-detail-section">
                <div className="item-detail-section-title">
                  <Package className="w-4 h-4" />
                  About This Item
                </div>
                <div className="item-detail-section-content">
                  {item.description}
                </div>
              </div>

              {/* Seller Information */}
              <div className="item-detail-section">
                <div className="item-detail-section-title">
                  <User className="w-4 h-4" />
                  Seller
                </div>
                <div className="item-detail-seller">
                  <div className="item-detail-seller-avatar">
                    {item.seller.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="item-detail-seller-info">
                    <h3>{item.seller.name}</h3>
                    <div className="item-detail-seller-location">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{item.seller.college}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pickup Location */}
              {item.location && (
                <div className="item-detail-section">
                  <div className="item-detail-section-title">
                    <MapPin className="w-4 h-4" />
                    Pickup Location
                  </div>
                  <div className="item-detail-section-content">
                    {item.location}
                  </div>
                </div>
              )}

              {/* Posted Date */}
              <div className="item-detail-section">
                <div className="item-detail-section-title">
                  <Calendar className="w-4 h-4" />
                  Posted Date
                </div>
                <div className="item-detail-section-content">
                  {formatDate(item.createdAt)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="item-detail-actions">
                {/* Wishlist Button */}
                {isAuthenticated && user?._id !== item?.seller._id && (
                  <button
                    className="item-detail-button item-detail-button-secondary"
                    onClick={handleWishlistClick}
                    disabled={wishlistMutation.isPending}
                  >
                    <Heart 
                      className={`h-4 w-4 transition-all duration-300 ${
                        isWishlisted 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-400'
                      }`} 
                    />
                    {wishlistMutation.isPending 
                      ? 'Updating...' 
                      : isWishlisted 
                        ? 'Remove from Wishlist' 
                        : 'Add to Wishlist'
                    }
                  </button>
                )}

                {/* Contact Button */}
                {user?._id === item?.seller._id ? (
                  <div className="item-detail-button item-detail-button-primary opacity-50 cursor-not-allowed">
                    <MessageCircle className="h-4 w-4" />
                    This is your item
                  </div>
                ) : (
                  <button
                    className="item-detail-button item-detail-button-primary"
                    onClick={async () => {
                      if (!isAuthenticated) {
                        navigate('/login', { state: { from: `/item/${id}` } });
                        return;
                      }
                      try {
                        const conv = await createConversation(id!, item!.seller._id);
                        navigate('/chat', { state: { activeConversationId: conv._id } });
                      } catch (err) {
                        console.error('[ItemDetail] Failed to create/open conversation:', err);
                        
                        // Fallback: Navigate to chat page without activeConversationId
                        // The chat page will show the conversation list where user can manually select
                        navigate('/chat');
                        
                        toast({
                          title: 'Chat opened',
                          description: 'Please select your conversation from the list.',
                        });
                      }
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Start Conversation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
