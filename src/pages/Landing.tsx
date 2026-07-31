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
      {/* ============ HERO SECTION - THE CAMPUS CHRONICLE EDITORIAL ============ */}
      <section className="editorial-bg paper-texture relative overflow-hidden">
        <div className="container py-8 md:py-10 max-w-8xl">
          {/* Editorial Header */}
          <div className="text-center mb-6 relative">
            <div className="inline-block relative">
              <h1 className="editorial-serif text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                The Campus Chronicle
              </h1>
              <div className="text-sm text-gray-500 font-medium">
                Where Campus Stories Come to Life
              </div>
              {/* Decorative elements */}
              <div className="pin top-2 right-0"></div>
              <div className="washi-tape top-0 left-4 w-16 transform -rotate-12"></div>
            </div>
          </div>

          {/* Editorial Collage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6 mb-10 relative">
            
            {/* Story: Textbook Success */}
            <div className="md:col-span-3 lg:col-span-3 relative">
              <div className="story-note rotate-1 p-5 relative z-10">
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    💡 Success Story
                  </span>
                </div>
                <h3 className="editorial-serif text-lg font-bold text-gray-900 mb-2 leading-tight">
                  Saved $800 on Engineering Books
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Marcus found everything he needed from classmates. Got notes included too!
                </p>
              </div>
              <div className="handwritten absolute -bottom-2 -right-4 z-0">
                "This is amazing!" →
              </div>
            </div>

            {/* Marketplace Preview: Bike */}
            <div className="md:col-span-2 lg:col-span-2 relative">
              <div className="marketplace-card p-4 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Bike className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Mountain Bike</h4>
                <p className="text-xs text-gray-600 mb-2">Great condition, barely used</p>
                <div className="price-tag px-2 py-1 text-xs inline-block">$180</div>
              </div>
              <div className="paper-clip absolute -top-2 -left-2"></div>
            </div>

            {/* Sticky Note */}
            <div className="md:col-span-1 lg:col-span-1 relative">
              <div className="sticky-note p-3 transform rotate-3">
                <div className="text-center">
                  <div className="font-semibold">Lab Coat</div>
                  <div className="text-xs mt-1">WANTED</div>
                  <div className="text-xs mt-1">Size M/L</div>
                </div>
              </div>
            </div>

            {/* Story: Dorm Makeover */}
            <div className="md:col-span-2 lg:col-span-2 relative">
              <div className="story-note rotate-2 p-4">
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                    🏠 Dorm Life
                  </span>
                </div>
                <h3 className="editorial-serif text-base font-bold text-gray-900 mb-2">
                  Complete Room Makeover
                </h3>
                <p className="text-xs text-gray-600">
                  Lisa transformed her space with items from upperclassmen
                </p>
              </div>
            </div>

            {/* Marketplace Preview: Laptop */}
            <div className="md:col-span-3 lg:col-span-3 relative">
              <div className="marketplace-card p-5">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-gray-500">1h ago</span>
                  </div>
                  <div className="sold-stamp px-2 py-1">SOLD</div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">MacBook Pro 2021</h4>
                <p className="text-sm text-gray-600 mb-2">Perfect for CS students, includes software</p>
                <div className="flex items-center justify-between">
                  <div className="price-tag px-2 py-1 text-sm">$1,200</div>
                  <div className="text-xs text-gray-500">✓ Verified seller</div>
                </div>
              </div>
              <div className="handwritten absolute -bottom-3 left-4 z-0">
                So fast!
              </div>
            </div>

            {/* Story: Study Groups */}
            <div className="md:col-span-2 lg:col-span-2 relative">
              <div className="story-note rotate-4 p-4">
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    📚 Community
                  </span>
                </div>
                <h3 className="editorial-serif text-base font-bold text-gray-900 mb-2">
                  Notes = New Friends
                </h3>
                <p className="text-xs text-gray-600">
                  Sharing study materials created lasting partnerships
                </p>
              </div>
            </div>

            {/* Marketplace Preview: Books */}
            <div className="md:col-span-1 lg:col-span-1">
              <div className="marketplace-card p-3 h-full flex flex-col justify-center">
                <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div className="text-xs text-center text-gray-600">Chemistry</div>
                <div className="text-xs text-center font-semibold">$45</div>
              </div>
            </div>

            {/* Story: Cycling Community */}
            <div className="md:col-span-2 lg:col-span-2 relative">
              <div className="story-note rotate-1 p-4">
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    🚴 Transport
                  </span>
                </div>
                <h3 className="editorial-serif text-base font-bold text-gray-900 mb-2">
                  Campus Bike Network
                </h3>
                <p className="text-xs text-gray-600">
                  Students sharing bikes = 40% more cycling club members
                </p>
              </div>
              <div className="pin absolute top-4 right-4"></div>
            </div>

            {/* Electronics Hub */}
            <div className="md:col-span-2 lg:col-span-2">
              <div className="story-note rotate-3 p-4 bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    ⚡ Tech Hub
                  </span>
                </div>
                <h3 className="editorial-serif text-base font-bold text-gray-900 mb-2">
                  Monthly Tech Swaps
                </h3>
                <p className="text-xs text-gray-600">
                  Where students upgrade gadgets within budget
                </p>
              </div>
            </div>

            {/* Quick Listings */}
            <div className="md:col-span-1 lg:col-span-1 space-y-2">
              <div className="marketplace-card p-2 text-center">
                <FileText className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                <div className="text-xs font-medium">Notes</div>
                <div className="text-xs text-gray-500">$12</div>
              </div>
              <div className="marketplace-card p-2 text-center">
                <FlaskConical className="w-4 h-4 mx-auto text-teal-600 mb-1" />
                <div className="text-xs font-medium">Goggles</div>
                <div className="text-xs text-gray-500">$8</div>
              </div>
            </div>

            {/* Handwritten arrows and doodles */}
            <div className="doodle-arrow absolute top-1/4 left-1/2 transform -translate-x-1/2 text-2xl">
              ↗
            </div>
            <div className="doodle-arrow absolute top-3/4 right-1/4 text-xl transform rotate-45">
              →
            </div>
          </div>

          {/* Campus Market Call-to-Action */}
          <div className="text-center mb-6 relative">
            <div className="max-w-4xl mx-auto">
              <h2 className="editorial-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                This is Campus Market
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Every story above happened here. Real students, real exchanges, real community.
              </p>

              {/* Interactive Search */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Find books, bikes, notes, lab gear..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full bg-white/90 backdrop-blur focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val) window.location.href = `/browse?search=${encodeURIComponent(val)}`;
                      }
                    }}
                  />
                </div>
                <Link
                  to="/browse"
                  className="btn-primary whitespace-nowrap inline-flex items-center gap-2 px-6 py-3"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Community Stats */}
              <div className="inline-flex items-center gap-6 text-sm text-gray-600 bg-white/70 backdrop-blur rounded-full px-6 py-3 border border-gray-200">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-purple-600">500+</span>
                  <span>listings</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-pink-500" />
                  <span className="font-semibold text-purple-600">1,000+</span>
                  <span>students</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  <span className="font-semibold text-purple-600">50+</span>
                  <span>campuses</span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 left-1/4 handwritten text-purple-600 opacity-60">
              Join us! ↑
            </div>
            <div className="absolute -bottom-2 right-1/3 handwritten text-pink-600 opacity-60">
              ← Start here
            </div>
          </div>

          {/* Editorial Illustration Placeholder */}
          <div className="max-w-5xl mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center bg-white/50 backdrop-blur-sm relative">
              <div className="washi-tape top-0 left-1/4 w-20 transform -rotate-6"></div>
              <div className="pin absolute top-4 right-8"></div>
              
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <h3 className="editorial-serif text-lg font-semibold text-gray-700 mb-2">
                  Editorial Illustration
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-2">
                  Custom artwork showing the vibrant campus community: students trading books under trees, 
                  bike exchanges by the library, study groups sharing notes, and tech meetups in common areas.
                </p>
                <div class="handwritten text-xs text-purple-600">
                  Coming soon! ✨
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COMIC STRIP SECTION - HOW THIS STORY HAPPENS ============ */}
      <section className="comic-strip py-8 md:py-12 relative">
        <div className="container max-w-7xl">
          {/* Comic Strip Header */}
          <div className="text-center mb-6 relative">
            <h2 className="editorial-serif text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              How This Story Happens
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Follow Alex's journey from need to exchange
            </p>
            {/* Decorative doodles */}
            <div className="comic-doodle absolute -top-2 -right-4">
              ★ real story!
            </div>
          </div>

          {/* Comic Strip Panels */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 relative">
            
            {/* Panel 1: Need */}
            <div className="comic-panel p-4 w-full max-w-[200px] h-[160px] relative">
              <div className="panel-number">1</div>
              <div className="flex flex-col items-center h-full justify-between">
                <div className="thought-bubble mb-2">
                  Need calculus book for tomorrow's exam...
                </div>
                <div className="comic-character">
                  😰
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-700">Alex needs help</div>
                  <div className="text-xs text-gray-500">Sunday, 11 PM</div>
                </div>
              </div>
              {/* Stress lines */}
              <div className="comic-action-line absolute top-8 right-4"></div>
              <div className="comic-action-line absolute top-10 right-6"></div>
              <div className="comic-action-line absolute top-6 right-8"></div>
            </div>

            {/* Arrow 1 */}
            <div className="comic-arrow rotate-0 lg:rotate-0 transform lg:transform-none">
              →
            </div>

            {/* Panel 2: Search */}
            <div className="comic-panel p-4 w-full max-w-[200px] h-[160px] relative">
              <div className="panel-number">2</div>
              <div className="flex flex-col items-center h-full justify-between">
                <div className="speech-bubble mb-2">
                  Let me check Campus Market!
                </div>
                <div className="flex items-center gap-2">
                  <div className="comic-character">
                    😊
                  </div>
                  <div className="phone-mockup"></div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-700">Opens app</div>
                  <div className="text-xs text-gray-500">Searches "calculus"</div>
                </div>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="comic-arrow">
              →
            </div>

            {/* Panel 3: Connect */}
            <div className="comic-panel p-4 w-full max-w-[200px] h-[160px] relative">
              <div className="panel-number">3</div>
              <div className="flex flex-col items-center h-full justify-between">
                <div className="speech-bubble mb-2">
                  "Perfect! Still available?"
                </div>
                <div className="flex items-center gap-1">
                  <div className="comic-character">
                    😄
                  </div>
                  <div className="text-xs text-gray-500">💬</div>
                  <div className="comic-character character-2">
                    📚
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-700">Found Sam's listing</div>
                  <div className="text-xs text-gray-500">Messages sent</div>
                </div>
              </div>
            </div>

            {/* Arrow 3 */}
            <div className="comic-arrow">
              →
            </div>

            {/* Panel 4: Meet */}
            <div className="comic-panel p-4 w-full max-w-[200px] h-[160px] relative">
              <div className="panel-number">4</div>
              <div className="flex flex-col items-center h-full justify-between">
                <div className="speech-bubble mb-2">
                  "Thanks! Here's $40"
                </div>
                <div className="flex items-center gap-2">
                  <div className="comic-character">
                    😊
                  </div>
                  <div className="handshake-icon"></div>
                  <div className="comic-character character-2">
                    😊
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-700">Library meetup</div>
                  <div className="text-xs text-gray-500">Safe on campus</div>
                </div>
              </div>
              {/* Happy particles */}
              <div className="comic-doodle top-2 right-2">✨</div>
            </div>

            {/* Arrow 4 */}
            <div className="comic-arrow">
              →
            </div>

            {/* Panel 5: Success */}
            <div className="comic-panel p-4 w-full max-w-[200px] h-[160px] relative">
              <div className="panel-number">5</div>
              <div className="flex flex-col items-center h-full justify-between">
                <div className="thought-bubble mb-2">
                  Exam ready! Sam was so helpful.
                </div>
                <div className="comic-character">
                  🤓
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-700">Mission complete</div>
                  <div className="text-xs text-gray-500">New campus friend!</div>
                </div>
              </div>
              {/* Success effects */}
              <div className="comic-doodle top-1 right-1">⭐</div>
              <div className="comic-doodle bottom-1 left-1">💯</div>
            </div>

            {/* Decorative elements around the strip */}
            <div className="comic-doodle absolute -top-4 left-1/4 hidden lg:block">
              "So easy!"
            </div>
            <div className="comic-doodle absolute -bottom-6 right-1/3 hidden lg:block">
              ↑ happens every day!
            </div>
          </div>

          {/* Comic Strip Footer */}
          <div className="text-center mt-6 relative">
            <div className="inline-block bg-white/90 backdrop-blur rounded-lg px-6 py-3 border-2 border-gray-300 relative">
              <p className="text-sm text-gray-700 font-medium">
                🎉 Your story starts here
              </p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <Link
                  to="/browse"
                  className="text-xs text-purple-600 font-semibold hover:text-purple-700 underline"
                >
                  Find what you need
                </Link>
                <span className="text-gray-400">•</span>
                <Link
                  to="/post"
                  className="text-xs text-purple-600 font-semibold hover:text-purple-700 underline"
                >
                  List an item
                </Link>
              </div>
              {/* Paper clip decoration */}
              <div className="category-paperclip absolute -top-2 -right-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES SECTION - CAMPUS NOTICE BOARD ============ */}
      <section className="notice-board py-8 md:py-12 relative">
        <div className="container max-w-8xl">
          {/* Notice Board Header */}
          <div className="text-center mb-8 relative">
            <div className="inline-block relative">
              <h2 className="editorial-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Campus Notice Board
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                What students are looking for around campus
              </p>
              {/* Decorative elements */}
              <div className="category-pin top-0 right-4"></div>
              <div className="handwritten absolute -bottom-6 -right-8 text-purple-600 opacity-60">
                Check these out! →
              </div>
            </div>
          </div>

          {/* Notice Board Collage */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 relative">
            
            {/* Books - Notebook Page (Large) */}
            <div className="md:col-span-2 lg:col-span-2 relative">
              <Link
                to="/browse?category=Books"
                className="block"
              >
                <div className="notebook-page rotate-notice-1 p-6 h-full relative">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Books</h3>
                      <p className="text-sm text-gray-600">Textbooks & Study Materials</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Engineering Math</span>
                      <span>$45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Physics Lab Manual</span>
                      <span>$25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Programming Guides</span>
                      <span>$35</span>
                    </div>
                  </div>
                  {/* Paper clip decoration */}
                  <div className="category-paperclip -top-2 -right-2"></div>
                </div>
              </Link>
            </div>

            {/* Electronics - Poster Card */}
            <div className="md:col-span-2 lg:col-span-2 relative">
              <Link
                to="/browse?category=Electronics"
                className="block"
              >
                <div className="poster-card rotate-notice-2 p-5 h-full">
                  <div className="text-center">
                    <Laptop className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 text-xl mb-2">ELECTRONICS</h3>
                    <p className="text-sm text-gray-600 mb-3">Laptops • Phones • Gadgets</p>
                    <div className="text-xs text-blue-700 font-semibold">
                      🔥 TRENDING NOW
                    </div>
                  </div>
                  {/* Stamp decoration */}
                  <div className="category-stamp top-2 right-2 w-8 h-8">NEW</div>
                </div>
              </Link>
            </div>

            {/* Furniture - Clipboard Note */}
            <div className="relative">
              <Link
                to="/browse?category=Furniture"
                className="block"
              >
                <div className="clipboard-note rotate-notice-3 p-4 h-full">
                  <div className="pt-2">
                    <Bed className="w-5 h-5 text-green-600 mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-1">Furniture</h3>
                    <p className="text-xs text-gray-600">Dorm & Study</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Cycles - Sticky Note */}
            <div className="relative">
              <Link
                to="/browse?category=Cycles"
                className="block"
              >
                <div className="sticky-category rotate-notice-4 p-4 h-full">
                  <Bike className="w-5 h-5 text-orange-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Cycles</h3>
                  <p className="text-xs text-gray-600">Campus Transport</p>
                  <div className="category-doodle -bottom-2 right-1">
                    fast!
                  </div>
                </div>
              </Link>
            </div>

            {/* Lab Equipment - Index Card */}
            <div className="md:col-span-2 lg:col-span-1 relative">
              <Link
                to="/browse?category=Lab Equipment"
                className="block"
              >
                <div className="index-card rotate-notice-5 p-4 h-full">
                  <FlaskConical className="w-5 h-5 text-teal-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Lab Equipment</h3>
                  <p className="text-xs text-gray-600">Goggles, Coats, Tools</p>
                  {/* Pin decoration */}
                  <div className="category-pin top-2 right-2"></div>
                </div>
              </Link>
            </div>

            {/* Study Notes - Torn Paper */}
            <div className="relative">
              <Link
                to="/browse?category=Study Notes"
                className="block"
              >
                <div className="torn-paper rotate-notice-6 p-4 h-full">
                  <FileText className="w-5 h-5 text-amber-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Study Notes</h3>
                  <p className="text-xs text-gray-600">Handwritten & Typed</p>
                </div>
              </Link>
            </div>

            {/* Hostel Essentials - Large Sticky */}
            <div className="md:col-span-2 lg:col-span-2 relative">
              <Link
                to="/browse?category=Hostel Essentials"
                className="block"
              >
                <div className="sticky-category rotate-notice-1 p-5 h-full relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm">🏠</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Hostel Essentials</h3>
                      <p className="text-sm text-gray-600">Room Setup & Daily Needs</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>• Mini Fridge</div>
                    <div>• Desk Lamp</div>
                    <div>• Storage Boxes</div>
                    <div>• Extension Cord</div>
                  </div>
                  {/* Tape decoration */}
                  <div className="category-tape top-0 left-4 w-12 transform -rotate-12"></div>
                </div>
              </Link>
            </div>

            {/* Sports & Fitness - Clipboard */}
            <div className="relative">
              <Link
                to="/browse?category=Sports"
                className="block"
              >
                <div className="clipboard-note rotate-notice-2 p-4 h-full">
                  <div className="pt-2 text-center">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-red-600 text-xs">⚽</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Sports</h3>
                    <p className="text-xs text-gray-600">Gear & Equipment</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Other - Small Note */}
            <div className="relative">
              <Link
                to="/browse"
                className="block"
              >
                <div className="notebook-page rotate-notice-3 p-4 h-full">
                  <div className="text-center">
                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-gray-600 text-xs">📦</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Other</h3>
                    <p className="text-xs text-gray-600">Everything Else</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Decorative elements scattered around */}
            <div className="category-doodle absolute top-1/4 left-1/2 transform -translate-x-1/2">
              ↗ popular
            </div>
            <div className="category-doodle absolute bottom-1/3 right-1/4">
              check these! →
            </div>
            
            {/* Pins scattered around */}
            <div className="category-pin absolute top-8 left-1/4"></div>
            <div className="category-pin absolute bottom-12 right-1/3"></div>
            
            {/* Tape pieces */}
            <div className="category-tape absolute top-1/3 right-1/4 w-8 transform rotate-45"></div>
          </div>

          {/* Bottom Notice */}
          <div className="text-center mt-8 relative">
            <div className="inline-block bg-white/80 backdrop-blur rounded-lg px-6 py-3 border border-gray-200 relative">
              <p className="text-sm text-gray-600">
                Can't find what you're looking for? 
                <Link to="/browse" className="text-purple-600 font-semibold ml-1 hover:text-purple-700">
                  Browse all items
                </Link>
                {' '}or{' '}
                <Link to="/post" className="text-purple-600 font-semibold hover:text-purple-700">
                  post a request
                </Link>
              </p>
              <div className="category-pin absolute -top-1 right-4"></div>
            </div>
            <div className="handwritten absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-purple-600 opacity-60">
              ↑ or just ask!
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA SECTION ============ */}
      <section className="editorial-bg py-12 md:py-16 relative">
        <div className="container max-w-6xl">
          {/* Illustration Placeholder */}
          <div className="mb-10 relative">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 md:p-12 text-center bg-white/50 backdrop-blur-sm relative">
              <div className="washi-tape top-0 left-1/4 w-20 transform -rotate-6"></div>
              <div className="pin absolute top-4 right-8"></div>
              
              <div className="max-w-lg mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 rounded-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                
                <h3 className="editorial-serif text-lg md:text-xl font-bold text-gray-700 mb-3">
                  Campus Illustration Placeholder
                </h3>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  A warm illustration of campus life: students sharing books under trees, 
                  bikes by the library, golden hour lighting making everything feel like home.
                </p>
              </div>
            </div>
          </div>

          {/* Closing Message & CTA */}
          <div className="text-center relative">
            <h2 className="editorial-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Every campus has stories.<br />
              <span className="text-purple-600">Yours starts here.</span>
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students discovering that the best deals, friendships, and campus memories happen right here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/25"
              >
                <Search className="h-4 w-4" />
                <span>Explore Marketplace</span>
              </Link>
              <Link
                to="/post"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 hover:-translate-y-1"
              >
                <span>Sell Item</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Decorative elements */}
            <div className="handwritten absolute -top-6 left-1/4 text-purple-600 opacity-60 text-sm">
              Your story awaits! ↑
            </div>
            <div className="handwritten absolute -bottom-2 right-1/3 text-pink-600 opacity-60 text-sm">
              ← Join us
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
