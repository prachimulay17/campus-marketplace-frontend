import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import ItemCard from '@/components/ItemCard';
import { mockItems, categories } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = useMemo(() => {
    return mockItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

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
                onClick={() => setActiveCategory(category.id)}
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

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
        </p>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
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
