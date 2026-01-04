import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <ShoppingBag className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">CampusMarket</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The trusted marketplace for college students. Buy and sell pre-owned items with fellow students on your campus.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/post" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/browse?category=books" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Books
                </Link>
              </li>
              <li>
                <Link to="/browse?category=electronics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/browse?category=furniture" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Furniture
                </Link>
              </li>
              <li>
                <Link to="/browse?category=clothing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Clothing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © 2024 CampusMarket. Made for students, by students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
