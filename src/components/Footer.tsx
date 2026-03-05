import { Link } from 'react-router-dom';
import { ShoppingBag, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative border-t border-purple-500/10">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-sm">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text-subtle">Campus Market</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
              The trusted marketplace for college students. Buy and sell pre-owned items safely within your campus community.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: Github, href: '#' },
                { icon: Mail, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/browse', label: 'Marketplace' },
                { to: '/post', label: 'Sell an Item' },
                { to: '/login', label: 'Login' },
                { to: '/signup', label: 'Sign Up' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-purple-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Categories</h4>
            <ul className="space-y-3">
              {[
                { to: '/browse?category=Books', label: 'Books' },
                { to: '/browse?category=Electronics', label: 'Electronics' },
                { to: '/browse?category=Furniture', label: 'Furniture' },
                { to: '/browse?category=Clothing', label: 'Clothing' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-purple-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Campus Market. Made with 💜 for students.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-gray-600 hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-600 hover:text-purple-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
