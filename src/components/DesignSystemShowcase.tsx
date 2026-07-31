import React from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Search, 
  Plus, 
  Settings, 
  Download,
  ExternalLink,
  Heart,
  Star,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';

/**
 * Design System Showcase Component
 * 
 * This component demonstrates all the design system elements.
 * Use this as a reference for implementing consistent UI components.
 * 
 * DO NOT USE THIS IN PRODUCTION - This is for reference only.
 */
export const DesignSystemShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 space-y-16">
      <div className="container-wide">
        <header className="text-center mb-16">
          <h1 className="text-step-5 mb-4 text-gradient">Campus Market Design System</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive showcase of our premium dark design system components, 
            inspired by Linear, Vercel, and Framer.
          </p>
        </header>

        {/* Typography Section */}
        <section className="space-y-8">
          <h2 className="text-step-4 border-b border-border pb-4">Typography</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-step-3">Headings</h3>
              <div className="space-y-2">
                <h1 className="text-6xl font-bold">Heading 1</h1>
                <h2 className="text-5xl font-bold">Heading 2</h2>
                <h3 className="text-4xl font-semibold">Heading 3</h3>
                <h4 className="text-3xl font-semibold">Heading 4</h4>
                <h5 className="text-2xl font-semibold">Heading 5</h5>
                <h6 className="text-xl font-semibold">Heading 6</h6>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-step-3">Body Text</h3>
              <div className="space-y-2">
                <p className="text-lg">Large text - Lorem ipsum dolor sit amet consectetur.</p>
                <p className="text-base">Base text - Lorem ipsum dolor sit amet consectetur.</p>
                <p className="text-sm">Small text - Lorem ipsum dolor sit amet consectetur.</p>
                <p className="text-xs">Extra small text - Lorem ipsum dolor sit amet.</p>
                <p className="text-2xs">Tiny text - Lorem ipsum dolor sit.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-step-3">Text Utilities</h3>
            <div className="space-y-2">
              <p className="text-gradient">Gradient text effect</p>
              <p className="text-muted-foreground">Muted foreground text</p>
              <p className="font-mono text-sm bg-card p-2 rounded">Monospace font for code</p>
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="space-y-8">
          <h2 className="text-step-4 border-b border-border pb-4">Color Palette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-step-3">Semantic Colors</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-primary text-primary-foreground p-4 rounded text-center text-sm">
                  Primary
                </div>
                <div className="bg-secondary text-secondary-foreground p-4 rounded text-center text-sm">
                  Secondary
                </div>
                <div className="bg-accent text-accent-foreground p-4 rounded text-center text-sm">
                  Accent
                </div>
                <div className="bg-muted text-muted-foreground p-4 rounded text-center text-sm">
                  Muted
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-step-3">Status Colors</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-success text-success-foreground p-4 rounded text-center text-sm">
                  Success
                </div>
                <div className="bg-warning text-warning-foreground p-4 rounded text-center text-sm">
                  Warning
                </div>
                <div className="bg-destructive text-destructive-foreground p-4 rounded text-center text-sm">
                  Destructive
                </div>
                <div className="bg-brand-500 text-white p-4 rounded text-center text-sm">
                  Brand
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-step-3">Gray Scale</h3>
              <div className="space-y-1">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                  <div
                    key={shade}
                    className={`bg-gray-${shade} p-2 rounded text-xs ${
                      shade >= 500 ? 'text-white' : 'text-gray-950'
                    }`}
                  >
                    Gray {shade}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="space-y-8">
          <h2 className="text-step-4 border-b border-border pb-4">Buttons</h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-step-3">Button Variants</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Primary
                </button>
                <button className="btn-secondary">
                  <Settings className="w-4 h-4" />
                  Secondary
                </button>
                <button className="btn-ghost">
                  <Heart className="w-4 h-4" />
                  Ghost
                </button>
                <button className="btn-outline">
                  <Download className="w-4 h-4" />
                  Outline
                </button>
                <button className="btn-destructive">
                  <X className="w-4 h-4" />
                  Destructive
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-step-3">Button Sizes</h3>
              <div className="flex flex-wrap items-end gap-4">
                <button className="btn-primary btn-sm">Small</button>
                <button className="btn-primary">Default</button>
                <button className="btn-primary btn-lg">Large</button>
                <button className="btn-primary btn-icon">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-step-3">Button States</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">Normal</button>
                <button className="btn-primary hover:bg-primary/90" disabled>Disabled</button>
                <button className="btn-primary opacity-75">Loading...</button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-8">
          <h2 className="text-step-4 border-b border-border pb-4">Form Elements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-step-3">Text Inputs</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Enter your password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="search"
                      className="input pl-10"
                      placeholder="Search items..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-step-3">Other Inputs</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Textarea</label>
                  <textarea
                    className="input min-h-[80px] resize-none"
                    placeholder="Enter description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Select</label>
                  <select className="input">
                    <option>Choose category</option>
                    <option>Books</option>
                    <option>Electronics</option>
                    <option>Furniture</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-8">
          <h2 className="text-step-4 border-b border-border pb-4">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Basic Card</h3>
                <p className="card-description">
                  A simple card with header, content, and footer.
                </p>
              </div>
              <div className="card-content">
                <p className="text-sm text-muted-foreground">
                  Card content goes here. This can contain any type of content.
                </p>
              </div>
              <div className="card-footer">
                <button className="btn-primary btn-sm">Action</button>
              </div>
            </div>

            <div className="card hover:shadow-card-hover transition-shadow">
              <div className="card-header">
                <h3 className="card-title">Interactive Card</h3>
                <p className="card-description">
                  Hover over this card to see the shadow effect.
                </p>
              </div>
              <div className="card-content">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4" />
                  <span>Featured item</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Glass Panel</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A card with glass morphism effect.
              </p>
              <button className="btn-ghost btn-sm">
                <ExternalLink className="w-4 h-4" />
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-8">
          <h2 className="text-step-4 border-b border-border pb-4">Badges</h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-step-3">Status Badges</h3>
              <div className="flex flex-wrap gap-2">
                <span className="badge-default">Default</span>
                <span className="badge-secondary">Secondary</span>
                <span className="badge-success">
                  <CheckCircle className="w-3 h-3" />
                  Success
                </span>
                <span className="badge-warning">
                  <AlertTriangle className="w-3 h-3" />
                  Warning
                </span>
                <span className="badge-destructive">
                  <XCircle className="w-3 h-3" />
                  Error
                </span>
                <span className="badge-outline">Outline</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-step-3">Category Badges</h3>
              <div className="flex flex-wrap gap-2">
                <span className="badge border-transparent" style={{backgroundColor: 'hsl(217.2 91.2% 59.8%)', color: 'white'}}>
                  Books
                </span>
                <span className="badge border-transparent" style={{backgroundColor: 'hsl(271.5 81.3% 55.9%)', color: 'white'}}>
                  Electronics
                </span>
                <span className="badge border-transparent" style={{backgroundColor: 'hsl(142.1 76.2% 36.3%)', color: 'white'}}>
                  Furniture
                </span>
                <span className="badge border-transparent" style={{backgroundColor: 'hsl(346.8 77.2% 49.8%)', color: 'white'}}>
                  Clothing
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-step-3">Condition Badges</h3>
              <div className="flex flex-wrap gap-2">
                <span className="badge border-transparent" style={{backgroundColor: 'hsl(142.1 76.2% 36.3%)', color: 'white'}}>
                  <Check className="w-3 h-3" />
                  New
                </span>
                <span className="badge border-transparent" style={{backgroundColor: 'hsl(217.2 91.2% 59.8%)', color: 'white'}}>
                  Good
                </span>
                <span className="badge border-transparent" style={{backgroundColor: 'hsl(47.9 95.8% 53.1%)', color: 'hsl(26 83.3% 14.1%)'}}>
                  Fair
                </span>
                <span className="badge border-transparent" style={{backgroundColor: 'hsl(240 5% 64.9%)', color: 'white'}}>
                  Used
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Shadows Section */}
        <section className="space-y-8">
          <h2 className="text-step-4 border-b border-border pb-4">Shadows & Effects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Card Shadow', class: 'shadow-card' },
              { name: 'Hover Shadow', class: 'shadow-card-hover' },
              { name: 'Glow Effect', class: 'shadow-glow' },
              { name: 'Border Glow', class: 'shadow-border' }
            ].map(({ name, class: shadowClass }) => (
              <div
                key={name}
                className={`bg-card p-6 rounded-lg ${shadowClass}`}
              >
                <h4 className="font-semibold mb-2">{name}</h4>
                <p className="text-sm text-muted-foreground">
                  Shadow effect demo
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Animations Section */}
        <section className="space-y-8">
          <h2 className="text-step-4 border-b border-border pb-4">Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Fade In', class: 'animate-fade-in' },
              { name: 'Fade Up', class: 'animate-fade-in-up' },
              { name: 'Scale In', class: 'animate-scale-in' },
              { name: 'Slide In', class: 'animate-slide-in-from-bottom' }
            ].map(({ name, class: animClass }) => (
              <div
                key={name}
                className={`bg-card p-6 rounded-lg ${animClass}`}
              >
                <h4 className="font-semibold mb-2">{name}</h4>
                <p className="text-sm text-muted-foreground">
                  Animation demo
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing Section */}
        <section className="space-y-8">
          <h2 className="text-step-4 border-b border-border pb-4">Spacing System</h2>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Based on a 4px grid system. Each unit represents 4px.
            </p>
            <div className="space-y-2">
              {[1, 2, 3, 4, 6, 8, 12, 16, 20, 24].map((space) => (
                <div key={space} className="flex items-center gap-4">
                  <span className="text-sm font-mono w-8">{space}</span>
                  <div
                    className="bg-brand-500 h-4"
                    style={{ width: `${space * 4}px` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {space * 4}px
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-16 border-t border-border">
          <p className="text-muted-foreground">
            Campus Market Design System • Built with accessibility and consistency in mind
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;