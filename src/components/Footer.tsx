import { Link } from 'react-router-dom';
import { ShoppingBag, MapPin, Mail, Twitter, Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="editorial-bg border-t border-dashed border-gray-300">
      {/* Campus Skyline Placeholder */}
      <div className="container py-6">
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 rounded-lg px-6 py-3">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-2 h-6 bg-gray-400 rounded-t-lg"></div>
              <div className="w-3 h-8 bg-gray-500 rounded-t-lg"></div>
              <div className="w-2 h-5 bg-gray-400 rounded-t-lg"></div>
              <div className="w-4 h-7 bg-gray-600 rounded-t-lg"></div>
              <div className="w-2 h-6 bg-gray-400 rounded-t-lg"></div>
              <div className="w-3 h-6 bg-gray-500 rounded-t-lg"></div>
              <div className="w-2 h-4 bg-gray-400 rounded-t-lg"></div>
            </div>
            <div className="text-xs text-gray-600 font-medium">🎨 Campus Skyline Illustration</div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="container pb-6">
        <div className="grid gap-6 md:grid-cols-4 relative">
          
          {/* Brand Section */}
          <div className="md:col-span-2 relative">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="editorial-serif text-lg font-bold text-gray-900">Campus Market</span>
            </Link>
            
            <p className="text-sm text-gray-600 max-w-sm leading-relaxed mb-4">
              Where campus stories come to life. The trusted marketplace connecting students 
              with the items and community they need.
            </p>
            
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Mail, href: '#', label: 'Email' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            
            {/* Decorative pin */}
            <div className="pin absolute top-4 right-8"></div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Explore</h4>
            <ul className="space-y-2">
              {[
                { to: '/browse', label: 'Browse Items' },
                { to: '/post', label: 'Sell Something' },
                { to: '/browse?category=Books', label: 'Books' },
                { to: '/browse?category=Electronics', label: 'Electronics' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-gray-600 hover:text-purple-600 hover:underline transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Community</h4>
            <ul className="space-y-2">
              {[
                { to: '/login', label: 'Join Now' },
                { to: '/signup', label: 'Create Account' },
                { href: '#', label: 'Campus Stories' },
                { href: '#', label: 'Student Success' },
              ].map((link) => (
                <li key={link.to || link.href}>
                  {link.to ? (
                    <Link 
                      to={link.to} 
                      className="text-sm text-gray-600 hover:text-purple-600 hover:underline transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      href={link.href} 
                      className="text-sm text-gray-600 hover:text-purple-600 hover:underline transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-4 border-t border-dashed border-gray-300 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Copyright */}
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-600">
                © {new Date().getFullYear()} Campus Market
              </p>
              <span className="text-xs text-gray-400">•</span>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-pink-500" />
                <span>for students</span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-gray-600 hover:text-purple-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-gray-600 hover:text-purple-600 transition-colors">
                Terms of Service
              </a>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <MapPin className="w-3 h-3 text-blue-500" />
                <span>Campus-wide</span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="handwritten absolute -top-3 left-1/3 text-purple-600 opacity-60 text-xs">
            Thanks for being part of our story! ✨
          </div>
          <div className="washi-tape absolute top-0 right-1/4 w-10 transform -rotate-12"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
