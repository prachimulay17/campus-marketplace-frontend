import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Item, Category, Condition } from '@/types';

interface ItemCardProps {
  item: Item;
}

const getCategoryVariant = (category: Category) => {
  const variants: Record<Category, 'default' | 'secondary'> = {
    books: 'default',
    electronics: 'secondary',
    furniture: 'default',
    clothing: 'secondary',
    other: 'default',
  };
  return variants[category];
};

const getConditionVariant = (condition: Condition) => {
  const variants: Record<Condition, 'default' | 'secondary'> = {
    new: 'secondary',
    good: 'default',
    fair: 'default',
    used: 'secondary',
  };
  return variants[condition];
};

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <Link
      to={`/item/${item.id}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2">
          <Badge className={getCategoryVariant(item.category) === 'secondary' ? 'bg-secondary' : ''}>
            {capitalizeFirst(item.category)}
          </Badge>
          <Badge className={getConditionVariant(item.condition) === 'secondary' ? 'bg-secondary' : ''}>
            {capitalizeFirst(item.condition)}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {/* Price */}
        <p className="text-lg font-bold text-primary">
          ${item.price}
        </p>
      </div>
    </Link>
  );
};

export default ItemCard;
