import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Search, BookOpen, Laptop, FileText,
  Bed, Bike, FlaskConical, Star, MapPin, Heart,
  Sparkles, TrendingUp, ShieldCheck
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useQuery } from '@tanstack/react-query';
import api, { endpoints } from '@/lib/api';
import { ItemsListResponse } from '@/types';
import ItemCard from '@/components/ItemCard';

const categories = [
  { icon: BookOpen, label: 'Books', color: 'from-blue-500 to-cyan-400', bg: 'bg-blue-500/10' },
  { icon: Laptop, label: 'Electronics', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10' },
  { icon: FileText, label: 'Study Notes', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-500/10' },
  { icon: Bed, label: 'Hostel Essentials', color: 'from-green-400 to-emerald-500', bg: 'bg-green-500/10' },
  { icon: Bike, label: 'Cycles', color: 'from-red-400 to-rose-500', bg: 'bg-red-500/10' },
  { icon: FlaskConical, label: 'Lab Equipment', color: 'from-indigo-400 to-violet-500', bg: 'bg-indigo-500/10' },
];

const Landing = () => {
  // Fetch featured items
  const { data: itemsResponse } = useQuery({
    queryKey: ['featured-items'],
    queryFn: async () => {
      const response = await api.get<{ data: ItemsListResponse }>(endpoints.items.list, {
        params: { limit: 6, sortBy: 'createdAt', sortOrder: 'desc' },
      });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const items = itemsResponse?.items || [];

  return (
    <Layout>
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/80 via-background to-indigo-950/50" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        {/* Glow orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[200px]" />

        <div className="container relative py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 animate-fade-in">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Your Campus Marketplace</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in leading-tight" style={{ animationDelay: '0.1s' }}>
                Buy, Sell &{' '}
                <span className="gradient-text">Discover</span>
                {' '}within Your Campus
              </h1>

              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
                The trusted marketplace where students sell books, gadgets, notes, hostel essentials and more — all within your campus community.
              </p>

              {/* Search bar */}
              <div className="relative max-w-lg mx-auto lg:mx-0 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="relative glass rounded-2xl group hover:border-purple-500/30 transition-all duration-300 mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="w-full bg-transparent pl-12 pr-6 py-4 text-white placeholder:text-gray-500 focus:outline-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val) window.location.href = `/browse?search=${encodeURIComponent(val)}`;
                      }
                    }}
                  />
                </div>
                <div className="flex justify-start pl-2">
                  <Link
                    to="/browse"
                    className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 shadow-lg hover:-translate-y-1 transition-all"
                  >
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-xs text-gray-500">Active Listings</p>
                </div>
                <div className="w-px h-10 bg-purple-500/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">1K+</p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="w-px h-10 bg-purple-500/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">50+</p>
                  <p className="text-xs text-gray-500">Campuses</p>
                </div>
              </div>
            </div>

            {/* Right - Illustration */}
            <div className="hidden lg:flex items-center justify-center animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
                <img
                  src="/hero-illustration.png"
                  alt="Students trading items on campus"
                  className="relative w-full max-w-lg animate-float rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES SECTION ============ */}
      <section className="py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/30 to-background" />
        <div className="container relative">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">
              Campus Market Categories
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Find What You Need
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-6 md:overflow-visible">
            {categories.map((cat, i) => (
              <Link
                key={cat.label}
                to={`/browse?category=${cat.label}`}
                className="group flex-shrink-0 w-36 md:w-auto"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl glass hover:bg-purple-500/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-purple-md">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors whitespace-nowrap">
                    {cat.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section className="py-16 md:py-20 relative">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">
              Why Campus Market?
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Built for Students, By Students
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Safe & Campus-Only',
                desc: 'Trade with verified students from your college. Meet on campus for safe exchanges.',
                gradient: 'from-green-500 to-emerald-400',
              },
              {
                icon: TrendingUp,
                title: 'Easy to Sell',
                desc: 'List your items in minutes. Take a photo, set a price, and start earning.',
                gradient: 'from-purple-500 to-violet-400',
              },
              {
                icon: Heart,
                title: 'Reuse & Save',
                desc: 'Save money on textbooks and essentials. Give items a second life on campus.',
                gradient: 'from-pink-500 to-rose-400',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="group p-6 md:p-8 rounded-2xl glass hover:bg-purple-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-md animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MARKETPLACE SECTION ============ */}
      {items.length > 0 && (
        <section className="py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/20 to-background" />
          <div className="container relative">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">
                  Marketplace
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Recently Listed Items
                </h2>
              </div>
              <Link
                to="/browse"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.slice(0, 6).map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>

            <div className="sm:hidden mt-8 text-center">
              <Link
                to="/browse"
                className="gradient-btn px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
              >
                <span>View All Items</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ SELL CTA SECTION ============ */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700" />
            <div className="absolute inset-0 bg-dot-pattern opacity-20" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]" />

            <div className="relative p-8 md:p-14 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium text-white/90">Start Earning Today</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Turn Your Unused Items<br className="hidden sm:block" /> into Cash
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
                Got old textbooks, electronics, or hostel gear? List them on Campus Market and connect with
                students who need them.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/post"
                  className="px-8 py-3.5 bg-white text-purple-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center gap-2"
                >
                  Post an Item
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/browse"
                  className="px-8 py-3.5 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20 inline-flex items-center gap-2"
                >
                  Explore Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
