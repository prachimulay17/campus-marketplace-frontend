# Campus Market Design System

A premium dark design system inspired by Linear, Vercel, and Framer. Built for consistency, accessibility, and developer experience.

## 🚀 Quick Start

### Using Design System Components

Import and use the pre-built CSS classes:

```tsx
import './styles/index.css';

// Buttons
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
<button className="btn-ghost">Ghost Action</button>

// Cards
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Card Title</h3>
    <p className="card-description">Card description</p>
  </div>
  <div className="card-content">
    Card content
  </div>
</div>

// Inputs
<input className="input" placeholder="Enter text..." />

// Badges
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
```

### Using Design Tokens

Import design tokens for consistent styling:

```tsx
import { colors, spacing, typography } from './styles/tokens';

// Use in styled components or CSS-in-JS
const StyledComponent = styled.div`
  color: hsl(${colors.primary});
  padding: ${spacing[4]};
  font-family: ${typography.fontFamily.sans.join(', ')};
`;

// Use in Tailwind classes
<div className="text-primary p-4 font-sans">
  Content
</div>
```

## 🎨 Design Philosophy

### Principles

1. **Minimal & Focused** - Clean interfaces that prioritize content
2. **Consistent & Predictable** - Unified patterns across all components  
3. **Accessible by Default** - WCAG 2.1 AA compliance
4. **Performance Optimized** - Efficient animations and optimized assets

### Inspiration

- **Linear** - Clean, minimal interface with subtle interactions
- **Vercel** - Premium feel with excellent typography and spacing
- **Framer** - Smooth animations and modern design patterns

## 🎯 Key Features

### ✅ Complete Component Library
- Buttons (Primary, Secondary, Ghost, Outline, Destructive)
- Form Elements (Inputs, Selects, Textareas)
- Cards with various layouts
- Badges for status and categories
- Navigation components

### ✅ Robust Color System
- Semantic color tokens (Primary, Secondary, Success, Warning, etc.)
- 11-step gray scale for perfect contrast
- Application-specific colors (Categories, Conditions)
- HSL-based for easy manipulation

### ✅ Typography Scale
- Inter font family for excellent readability
- Modular scale with consistent line heights
- Responsive typography utilities
- Proper heading hierarchy

### ✅ Advanced Shadow System
- Minimal shadows inspired by Linear
- Custom glow effects for dark theme
- Consistent elevation patterns
- Hover state enhancements

### ✅ Animation Framework
- Smooth, performant animations
- Directional fade/slide animations
- Scale and transform effects
- Consistent timing and easing

### ✅ Accessibility First
- Proper contrast ratios (4.5:1 minimum)
- Keyboard navigation support
- Screen reader compatibility
- Focus indicator consistency

## 📁 File Structure

```
src/styles/
├── README.md              # This file
├── design-system.md       # Complete documentation
├── tokens.ts              # Design tokens (colors, spacing, etc.)
└── index.css              # Main CSS file with components

src/components/
└── DesignSystemShowcase.tsx  # Component demonstration (dev only)
```

## 🛠 Technical Details

### CSS Architecture
- **Tailwind CSS** for utility-first styling
- **CSS Custom Properties** for theming
- **Component Classes** for reusable patterns
- **Layer System** for proper cascading

### Design Tokens
All design decisions are tokenized for consistency:
- Colors (HSL values)
- Typography (font families, sizes, weights)
- Spacing (4px grid system)
- Border radius (subtle, modern values)
- Shadows (minimal, layered approach)
- Animation (duration, easing curves)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Custom Properties support required
- Backdrop-filter support for glass effects

## 🎨 Usage Examples

### Button Variants

```tsx
// Size variants
<button className="btn-primary btn-sm">Small</button>
<button className="btn-primary">Default</button> 
<button className="btn-primary btn-lg">Large</button>

// Style variants
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-ghost">Ghost</button>
<button className="btn-outline">Outline</button>
<button className="btn-destructive">Destructive</button>

// Icon buttons
<button className="btn-primary btn-icon">
  <Icon className="w-4 h-4" />
</button>
```

### Card Layouts

```tsx
// Basic card
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Title</h3>
    <p className="card-description">Description</p>
  </div>
  <div className="card-content">
    <p>Content goes here</p>
  </div>
  <div className="card-footer">
    <button className="btn-primary">Action</button>
  </div>
</div>

// Interactive card with hover effect
<div className="card hover:shadow-card-hover transition-shadow cursor-pointer">
  <div className="card-content">
    <h3 className="font-semibold">Interactive Card</h3>
    <p className="text-muted-foreground">Hover for shadow effect</p>
  </div>
</div>

// Glass panel
<div className="glass-panel p-6 rounded-lg">
  <h3>Glass Effect Panel</h3>
  <p>With backdrop blur</p>
</div>
```

### Form Elements

```tsx
// Text input with icon
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <input className="input pl-10" placeholder="Search..." />
</div>

// Input with validation state
<input 
  className="input focus:ring-success focus:border-success" 
  placeholder="Valid input"
/>

// Textarea
<textarea 
  className="input min-h-[100px] resize-none" 
  placeholder="Enter description..."
/>
```

### Status Badges

```tsx
// Status badges
<span className="badge-success">
  <CheckIcon className="w-3 h-3" />
  Success
</span>
<span className="badge-warning">
  <AlertIcon className="w-3 h-3" />
  Warning
</span>
<span className="badge-destructive">
  <XIcon className="w-3 h-3" />
  Error
</span>

// Category badges (with dynamic colors)
<span 
  className="badge border-transparent" 
  style={{
    backgroundColor: 'hsl(var(--category-books))',
    color: 'white'
  }}
>
  Books
</span>
```

## 🔧 Customization

### Extending Colors

Add new colors to the CSS custom properties:

```css
:root {
  /* Add custom brand colors */
  --brand-accent: 280 100% 70%;
  --brand-accent-foreground: 0 0% 100%;
}
```

Then extend Tailwind config:

```ts
// tailwind.config.ts
extend: {
  colors: {
    'brand-accent': 'hsl(var(--brand-accent))',
    'brand-accent-foreground': 'hsl(var(--brand-accent-foreground))',
  }
}
```

### Creating Custom Components

Follow the component class pattern:

```css
/* Add to @layer components */
.btn-custom {
  @apply inline-flex items-center justify-center gap-2;
  @apply text-sm font-medium rounded-md transition-colors;
  @apply bg-brand-accent text-brand-accent-foreground;
  @apply hover:bg-brand-accent/90;
  @apply focus-visible:ring-2 focus-visible:ring-ring;
  @apply h-10 px-4 py-2;
}
```

### Theme Switching

The design system supports theme switching via CSS custom properties:

```tsx
// Theme switching logic
const toggleTheme = () => {
  document.documentElement.classList.toggle('light');
};

// CSS for light theme
.light {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* ... other light theme colors */
}
```

## 📱 Responsive Design

The design system includes responsive utilities:

```tsx
// Container classes
<div className="container-narrow">   {/* max-w-4xl */}
<div className="container-wide">     {/* max-w-7xl */}

// Responsive spacing
<div className="section-padding">    {/* py-12 md:py-16 lg:py-20 */}
<div className="section-padding-sm"> {/* py-8 md:py-10 lg:py-12 */}

// Responsive typography
<h1 className="text-2xl md:text-4xl lg:text-5xl">
  Responsive heading
</h1>
```

## ⚡ Performance

### Optimizations
- Minimal CSS bundle size
- Efficient animations using transforms
- Reduced paint and layout thrashing
- Optimized shadow rendering

### Best Practices
- Use `transform` and `opacity` for animations
- Prefer CSS custom properties over inline styles
- Lazy load non-critical design assets
- Use `will-change` sparingly

## 🧪 Testing

### Visual Regression Testing
- Test all component variants
- Verify accessibility compliance
- Check responsive behavior
- Validate animation performance

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- Focus management

## 📖 Resources

- [Design System Documentation](./design-system.md) - Complete component guide
- [Design Tokens](./tokens.ts) - All design tokens
- [Component Showcase](../components/DesignSystemShowcase.tsx) - Live examples
- [Tailwind Config](../../tailwind.config.ts) - Theme configuration

## 🤝 Contributing

### Adding New Components
1. Follow existing component patterns
2. Use design tokens for consistency
3. Ensure accessibility compliance
4. Add documentation and examples
5. Test across different viewports

### Modifying Existing Components
1. Consider backwards compatibility
2. Update documentation
3. Test thoroughly
4. Communicate changes to team

---

Built with ❤️ for the Campus Market team