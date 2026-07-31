import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Item, Category, Condition } from '@/types';
import { MapPin, Heart, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface ItemCardProps {
  item: Item;
}

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

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

const ItemCard = memo(({ item }: ItemCardProps) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [isWishlisted, setIsWishlisted] = useState(item.isWishlisted || false);

  // Sync local state with prop changes
  useEffect(() => {
    setIsWishlisted(item.isWishlisted || false);
  }, [item.isWishlisted]);

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(endpoints.items.toggleWishlist(item._id));
      return response.data;
    },
    onSuccess: (data) => {
      setIsWishlisted(data.data.isWishlisted);
      
      queryClient.setQueryData(['item', item._id], (oldData: any) => {
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

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to add items to your wishlist',
        variant: 'destructive',
      });
      return;
    }

    if (user?._id === item.seller._id) {
      toast({
        title: 'Cannot wishlist own item',
        description: 'You cannot add your own items to wishlist',
        variant: 'destructive',
      });
      return;
    }

    wishlistMutation.mutate();
  };

  return (
    <Link to={`/item/${item._id}`} className="campus-item-card block group">
      {/* Image Section */}
      <div className="campus-item-image">
        <img
          src={item.images[0]}
          alt={item.title}
          loading="lazy"
          decoding="async"
        />
        
        {/* Category and Condition Badges */}
        <div className="campus-item-badges">
          <span className={`campus-item-badge ${getCategoryColor(item.category)}`}>
            {item.category}
          </span>
          <span className={`campus-item-badge ${getConditionColor(item.condition)}`}>
            {item.condition}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={wishlistMutation.isPending}
          className="campus-item-wishlist"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted
                ? 'text-red-400 fill-red-400'
                : 'text-white'
            }`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="campus-item-content">
        {/* Title */}
        <h3 className="campus-item-title">{item.title}</h3>

        {/* Price */}
        <div className="campus-item-price">₹{item.price.toLocaleString()}</div>

        {/* Meta Information */}
        <div className="campus-item-meta">
          {/* Seller Info */}
          <div className="campus-item-seller">
            <div className="campus-seller-avatar">
              {item.seller.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{item.seller.name}</span>
          </div>

          {/* Location */}
          {item.seller.college && (
            <div className="campus-item-location">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{item.seller.college}</span>
            </div>
          )}

          {/* Time Posted */}
          <div className="campus-item-time flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Posted {getTimeAgo(item.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default ItemCard;
