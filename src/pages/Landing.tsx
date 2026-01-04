import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Users, Recycle } from 'lucide-react';
import Layout from '@/components/Layout';

const Landing = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container relative py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Buy & Sell on Campus,{' '}
              <span className="text-primary">The Easy Way</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              The trusted marketplace for college students. Find great deals on textbooks, electronics, furniture, and more from fellow students.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/browse">
                  Browse Items
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/post">Start Selling</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Why CampusMarket?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Built specifically for college students, making it easy to buy and sell within your campus community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-2xl bg-background shadow-soft">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Easy to Sell</h3>
              <p className="text-sm text-muted-foreground">
                List your items in minutes. Take a photo, set a price, and you're done. It's that simple.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-2xl bg-background shadow-soft">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Campus-Only</h3>
              <p className="text-sm text-muted-foreground">
                Trade with verified students from your college. Meet on campus for safe, convenient exchanges.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-2xl bg-background shadow-soft">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Reuse & Save</h3>
              <p className="text-sm text-muted-foreground">
                Save money on textbooks and essentials. Give items a second life instead of throwing them away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join thousands of students already buying and selling on CampusMarket. It's free to sign up!
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/signup">
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
