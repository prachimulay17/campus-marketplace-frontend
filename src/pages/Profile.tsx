import { Link } from 'react-router-dom';
import { Settings, Plus, Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Layout from '@/components/Layout';
import { mockUsers, mockItems } from '@/data/mockData';
import { Category, Condition } from '@/types';

const getCategoryVariant = (category: Category) => {
  const variants: Record<Category, 'books' | 'electronics' | 'furniture' | 'clothing' | 'other'> = {
    books: 'books',
    electronics: 'electronics',
    furniture: 'furniture',
    clothing: 'clothing',
    other: 'other',
  };
  return variants[category];
};

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const Profile = () => {
  // Mock current user
  const user = mockUsers[0];
  const userItems = mockItems.filter((item) => item.sellerId === user.id);

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-foreground mb-1">{user.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <MapPin className="h-4 w-4" />
                  {user.college}
                </div>
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* User's Listings */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Your Listings</h2>
            <p className="text-sm text-muted-foreground">{userItems.length} item{userItems.length !== 1 ? 's' : ''} listed</p>
          </div>
          <Button asChild>
            <Link to="/post">
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Link>
          </Button>
        </div>

        {userItems.length > 0 ? (
          <div className="grid gap-4">
            {userItems.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl shadow-card p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                <div className="w-full sm:w-32 aspect-[4/3] sm:aspect-square rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge variant={getCategoryVariant(item.category)} className="mb-2">
                        {capitalizeFirst(item.category)}
                      </Badge>
                      <h3 className="font-semibold text-foreground line-clamp-1">{item.title}</h3>
                      <p className="text-lg font-bold text-primary mt-1">${item.price}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                  
                  <p className="text-xs text-muted-foreground mt-3">
                    Posted on {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl">
            <p className="text-lg text-muted-foreground mb-4">You haven't listed any items yet</p>
            <Button asChild>
              <Link to="/post">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Item
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
