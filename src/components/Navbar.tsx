import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { ShoppingBag, Menu, X, Plus, User, LogOut, ChevronRight, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  // Track scroll for glassmorphism effect  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Marketplace' },
    { href: '/post', label: 'Sell Item' },
  ];

  const authenticatedLinks = [
    { href: '/chat', label: 'Messages', icon: MessageSquare },
  ];

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
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "glass-strong shadow-lg shadow-purple-950/20"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 md:h-18 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-sm group-hover:shadow-purple-md transition-shadow duration-300">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text-subtle">Campus Market</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                isActive(link.href)
                  ? "bg-purple-500/15 text-purple-300 shadow-inner"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && authenticatedLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 inline-flex items-center gap-1.5",
                  isActive(link.href)
                    ? "bg-purple-500/15 text-purple-300 shadow-inner"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-purple-500/30 hover:ring-purple-500/60 transition-all">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-sm font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-strong rounded-xl border-purple-500/10" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-3">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-purple-500/10" />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer rounded-lg">
                    <User className="mr-2 h-4 w-4 text-purple-400" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/post" className="cursor-pointer rounded-lg">
                    <Plus className="mr-2 h-4 w-4 text-purple-400" />
                    <span>Sell Item</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-purple-500/10" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-lg text-red-400 focus:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Link
                to="/signup"
                className="gradient-btn px-5 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 shadow-purple-sm hover:shadow-purple-md transition-shadow"
              >
                <span>Get Started</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-white/5 text-gray-300 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-strong border-t border-purple-500/10 animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive(link.href)
                    ? "bg-purple-500/15 text-purple-300"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && authenticatedLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2",
                    isActive(link.href)
                      ? "bg-purple-500/15 text-purple-300"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 pt-3 border-t border-purple-500/10">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <Avatar className="h-9 w-9 ring-2 ring-purple-500/30">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.college}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5 rounded-xl" asChild>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <User className="mr-2 h-4 w-4 text-purple-400" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-purple-500/20 text-gray-300 hover:bg-white/5 rounded-xl" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  </Button>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="gradient-btn flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-center inline-flex items-center justify-center"
                  >
                    <span>Get Started</span>
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
