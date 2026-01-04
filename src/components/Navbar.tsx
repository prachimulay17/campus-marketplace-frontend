import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Menu, X, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { href: '/browse', label: 'Browse' },
    { href: '/post', label: 'Sell Item' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">CampusMarket</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2 pt-2 border-t border-border">
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log in</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
