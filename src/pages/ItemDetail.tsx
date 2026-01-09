import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, MapPin, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Layout from '@/components/Layout';
import { useQuery } from '@tanstack/react-query';
import api, { endpoints } from '@/lib/api';
import { ItemResponse, Category, Condition } from '@/types';

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

const ItemDetail = () => {
  const { id } = useParams();

  const {
    data: itemResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const response = await api.get<ItemResponse>(endpoints.items.getById(id!));
      return response.data.data.item;
    },
    enabled: !!id,
  });

  const item = itemResponse;

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading item...</p>
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
          <h1 className="text-2xl font-bold text-foreground mb-4">Failed to load item</h1>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
          <Button asChild>
            <Link to="/browse">Back to Browse</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Not found state
  if (!item) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Item not found</h1>
          <Button asChild>
            <Link to="/browse">Back to Browse</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        {/* Back Button */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img src={image} alt={`${item.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={getCategoryVariant(item.category)}>
                {capitalizeFirst(item.category)}
              </Badge>
              <Badge variant={getConditionVariant(item.condition)}>
                {capitalizeFirst(item.condition)}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {item.title}
            </h1>

            {/* Price */}
            <p className="text-3xl font-bold text-primary mb-6">
              ${item.price}
            </p>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
                Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Posted Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Calendar className="h-4 w-4" />
              Posted on {new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>

            {/* Seller Card */}
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={item.seller.avatar} alt={item.seller.name} />
                  <AvatarFallback>{item.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.seller.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {item.seller.college}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <Button variant="hero" size="xl" className="w-full">
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Seller
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
