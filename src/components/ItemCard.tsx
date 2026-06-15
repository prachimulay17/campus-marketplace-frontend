import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Item, Category, Condition } from '@/types';
import { MapPin, Star, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface ItemCardProps {
  item: Item;
}

const getCategoryColor = (category: Category) => {
  const colors: Record<Category, string> = {
    Books: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Electronics: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Furniture: 'bg-green-500/20 text-green-300 border-green-500/30',
    Clothing: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    Others: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };
  return colors[category];
};

const getConditionColor = (condition: Condition) => {
  const colors: Record<Condition, string> = {
    'New': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Like New': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    'Used': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Poor': 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return colors[condition];
};

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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
      // Update local state first for immediate UI feedback
      setIsWishlisted(data.data.isWishlisted);
      
      // Update the cache to ensure consistency across components
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

      // Invalidate relevant queries to refresh data
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

    // Don't allow users to wishlist their own items
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
    <Link
      to={`/item/${item._id}`}
      className="group block rounded-2xl overflow-hidden glass hover:shadow-purple-lg transition-all duration-500 hover:-translate-y-2"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-purple-950/50">
        <img
          src={item.images[0]}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm ${getCategoryColor(item.category)}`}>
            {capitalizeFirst(item.category)}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm ${getConditionColor(item.condition)}`}>
            {capitalizeFirst(item.condition)}
          </span>
        </div>

        {/* Wishlist heart button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleWishlistClick}
            disabled={wishlistMutation.isPending}
            className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${
                isWishlisted
                  ? 'text-red-400 fill-red-400'
                  : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* View Details button on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="gradient-btn py-2 rounded-xl text-sm font-semibold text-center">
            <span>View Details</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-white line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors duration-300">
          {item.title}
        </h3>

        {/* Price */}
        <p className="text-xl font-bold gradient-text mb-3">
          ₹{item.price.toLocaleString()}
        </p>

        {/* Seller info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">
                {item.seller.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-gray-400 truncate">{item.seller.name}</span>
          </div>
          {item.seller.college && (
            <div className="flex items-center gap-1 text-gray-500 flex-shrink-0">
              <MapPin className="h-3 w-3" />
              <span className="text-xs truncate max-w-[80px]">{item.seller.college}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
});

export default ItemCard;
