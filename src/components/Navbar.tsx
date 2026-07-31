import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingBag, Menu, X, User, LogOut, Search, Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Track scroll for editorial navbar effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchValue)}`;
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header
      className={cn(
        "editorial-navbar sticky top-0 z-50 w-full",
        scrolled && "scrolled"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo with Tagline */}
        <Link to="/" className="campus-logo flex items-center gap-3 group">
          <div className="campus-logo-icon flex h-9 w-9 items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="editorial-serif text-xl font-bold text-gray-900 leading-none">
              Campus Market
            </span>
            <span className="campus-tagline">Student Marketplace</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            to="/browse"
            className={cn(
              "editorial-nav-link",
              isActive('/browse') && "active"
            )}
          >
            Explore
          </Link>
          <Link
            to="/browse"
            className={cn(
              "editorial-nav-link",
              isActive('/browse') && "active"
            )}
          >
            Marketplace
          </Link>
          <Link
            to="/post"
            className={cn(
              "editorial-nav-link",
              isActive('/post') && "active"
            )}
          >
            Sell Something
          </Link>
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Integrated Search */}
          <div className="campus-search flex items-center px-3 py-2 w-64">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search campus..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="campus-search-input"
            />
          </div>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {/* Messages */}
              <Link
                to="/chat"
                className="editorial-icon-btn p-2 relative"
              >
                <MessageSquare className="h-4 w-4" />
                {/* Notification dot could be added here */}
              </Link>
              
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="editorial-icon-btn p-2"
              >
                <Heart className="h-4 w-4" />
              </Link>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-lg hover:bg-purple-50 border border-gray-200 hover:border-purple-200 transition-all">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-white border border-gray-200 rounded-lg shadow-xl mt-2" 
                  align="end" 
                  forceMount
                >
                  <div className="flex items-center justify-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 m-1 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate w-[160px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-100 my-1" />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 mx-1">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="cursor-pointer rounded-md text-gray-700 hover:text-purple-700 hover:bg-purple-50 mx-1">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Wishlist</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100 my-1" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 mx-1"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/signup" className="join-campus-magazine px-4 py-2.5 inline-block text-decoration-none">
              Join Campus
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden editorial-icon-btn p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="editorial-mobile-menu md:hidden animate-fade-in">
          <div className="container py-4 flex flex-col gap-3">
            {/* Mobile Search */}
            <div className="campus-search flex items-center px-3 py-2.5 mb-2">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search campus..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="campus-search-input"
              />
            </div>

            {/* Mobile Navigation */}
            <Link
              to="/browse"
              className={cn(
                "editorial-mobile-nav-item px-4 py-3 text-sm font-medium",
                isActive('/browse') && "active"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/browse"
              className={cn(
                "editorial-mobile-nav-item px-4 py-3 text-sm font-medium",
                isActive('/browse') && "active"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/post"
              className={cn(
                "editorial-mobile-nav-item px-4 py-3 text-sm font-medium",
                isActive('/post') && "active"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Sell Something
            </Link>

            {/* Mobile Auth Section */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.college}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      to="/chat"
                      onClick={() => setIsMenuOpen(false)}
                      className="editorial-mobile-nav-item w-full flex items-center px-4 py-3"
                    >
                      <MessageSquare className="mr-3 h-4 w-4" />
                      Messages
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                      className="editorial-mobile-nav-item w-full flex items-center px-4 py-3"
                    >
                      <Heart className="mr-3 h-4 w-4" />
                      Wishlist
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="editorial-mobile-nav-item w-full flex items-center px-4 py-3"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="editorial-mobile-nav-item w-full flex items-center px-4 py-3 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="editorial-mobile-nav-item w-full block px-4 py-3 text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="join-campus-magazine w-full block px-4 py-3 text-center text-white"
                  >
                    Join Campus
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
