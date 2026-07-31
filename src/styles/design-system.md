# Campus Market Design System

A premium dark design system inspired by Linear, Vercel, and Framer. Built with accessibility, consistency, and developer experience in mind.

## Design Principles

- **Minimal & Focused**: Clean interfaces that prioritize content and user tasks
- **Consistent & Predictable**: Unified patterns across all components and interactions  
- **Accessible by Default**: WCAG 2.1 AA compliance with proper contrast and keyboard navigation
- **Performance Optimized**: Efficient animations and optimized asset loading

## Color System

### Semantic Colors
Our color system uses HSL values for better manipulation and theming.

```css
/* Surface Colors */
--background: 240 10% 3.9%        /* App background */
--card: 240 10% 4.9%              /* Card/panel background */
--popover: 240 5.9% 10%           /* Overlay background */

/* Text Colors */
--foreground: 0 0% 98%            /* Primary text */
--muted-foreground: 240 5% 64.9%  /* Secondary text */

/* Interactive Colors */
--primary: 0 0% 98%               /* Primary actions */
--secondary: 240 3.7% 15.9%       /* Secondary actions */
--accent: 240 3.7% 15.9%          /* Hover states */

/* Status Colors */
--destructive: 0 84.2% 60.2%      /* Error states */
--warning: 47.9 95.8% 53.1%       /* Warning states */
--success: 142.1 76.2% 36.3%      /* Success states */

/* Border & Input */
--border: 240 3.7% 15.9%          /* Default borders */
--input: 240 3.7% 15.9%           /* Input borders */
--ring: 240 10% 3.9%              /* Focus rings */
```

### Neutral Gray Scale
A carefully crafted gray scale for maximum flexibility:

```css
--gray-50: 240 4.8% 95.9%    /* Lightest */
--gray-100: 240 4.8% 83.9%
--gray-200: 240 5.9% 64.9%
--gray-300: 240 5.2% 48%
--gray-400: 240 3.8% 46.1%
--gray-500: 240 3.7% 15.9%   /* Mid-range */
--gray-600: 240 5.2% 33.9%
--gray-700: 240 5.3% 26.1%
--gray-800: 240 3.7% 15.9%
--gray-900: 240 5.9% 10%
--gray-950: 240 10% 3.9%     /* Darkest */
```

## Typography

### Font Stack
```css
font-family: 'Inter', system-ui, sans-serif;
```

**Inter** provides excellent readability and modern feel across all platforms.

### Type Scale
Based on a modular scale for consistency:

```css
/* Sizes */
2xs: 0.625rem (10px)    line-height: 0.875rem
xs:  0.75rem (12px)     line-height: 1rem
sm:  0.875rem (14px)    line-height: 1.25rem
base: 1rem (16px)       line-height: 1.5rem
lg:  1.125rem (18px)    line-height: 1.75rem
xl:  1.25rem (20px)     line-height: 1.75rem
2xl: 1.5rem (24px)      line-height: 2rem
3xl: 1.875rem (30px)    line-height: 2.25rem
4xl: 2.25rem (36px)     line-height: 2.5rem
5xl: 3rem (48px)        line-height: 1.16
6xl: 3.75rem (60px)     line-height: 1.1
```

### Typography Classes
```css
.text-step-1  /* text-lg font-medium */
.text-step-2  /* text-xl font-semibold */
.text-step-3  /* text-2xl font-semibold */
.text-step-4  /* text-3xl font-bold */
.text-step-5  /* text-4xl font-bold */
```

## Spacing System

Based on a 4px grid system for consistency:

```css
/* Additional spacing tokens */
18: 4.5rem (72px)
88: 22rem (352px)
112: 28rem (448px)
128: 32rem (512px)
```

## Border Radius

Subtle, modern border radii:

```css
2xs: 0.125rem (2px)     /* Very subtle */
xs:  0.25rem (4px)      /* Subtle */
sm:  0.375rem (6px)     /* Small elements */
md:  0.5rem (8px)       /* Default */
lg:  0.75rem (12px)     /* Cards, panels */
xl:  1rem (16px)        /* Large components */
2xl: 1.5rem (24px)      /* Hero elements */
3xl: 2rem (32px)        /* Very large elements */
```

## Shadow System

Minimal, layered shadows inspired by Linear:

```css
/* Standard shadows */
xs:  0 1px 2px 0 rgb(0 0 0 / 0.05)
sm:  0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)

/* Custom glow shadows */
glow:    0 0 0 1px rgb(255 255 255 / 0.05)
glow-sm: 0 0 0 1px rgb(255 255 255 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.4)
glow-md: 0 0 0 1px rgb(255 255 255 / 0.05), 0 4px 6px -1px rgb(0 0 0 / 0.1)
glow-lg: 0 0 0 1px rgb(255 255 255 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1)
```

## Component System

### Buttons

#### Primary Button
```jsx
<button className="btn-primary">
  Primary Action
</button>
```

#### Secondary Button  
```jsx
<button className="btn-secondary">
  Secondary Action
</button>
```

#### Ghost Button
```jsx
<button className="btn-ghost">
  Subtle Action
</button>
```

#### Outline Button
```jsx
<button className="btn-outline">
  Border Action
</button>
```

#### Size Variants
```jsx
<button className="btn-primary btn-sm">Small</button>
<button className="btn-primary">Default</button>
<button className="btn-primary btn-lg">Large</button>
<button className="btn-primary btn-icon">
  <Icon />
</button>
```

### Inputs

#### Text Input
```jsx
<input className="input" placeholder="Enter text..." />
```

### Cards

#### Basic Card
```jsx
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Title</h3>
    <p className="card-description">Description</p>
  </div>
  <div className="card-content">
    Content goes here
  </div>
  <div className="card-footer">
    Footer actions
  </div>
</div>
```

### Badges

#### Status Badges
```jsx
<span className="badge-default">Default</span>
<span className="badge-secondary">Secondary</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-destructive">Error</span>
<span className="badge-outline">Outline</span>
```

## Utility Classes

### Layout
```css
.center       /* Flex center alignment */
.stack        /* Flex column */
.hstack       /* Flex row with items-center */
.section-padding     /* Standard section spacing */
.section-padding-sm  /* Compact section spacing */
.container-narrow    /* Max-width 4xl */
.container-wide      /* Max-width 7xl */
```

### Interactive States
```css
.interactive     /* Smooth hover/active transforms */
.focus-ring     /* Standard focus ring */
```

### Glass Effects
```css
.glass-panel    /* Subtle glass effect */
.glass-strong   /* Strong glass effect */
```

### Text Effects
```css
.text-gradient  /* Gradient text effect */
.text-balance   /* Balanced text wrapping */
```

### Scrollbars
```css
.scrollbar-thin  /* Thin custom scrollbar */
.hide-scrollbar  /* Hide scrollbar completely */
```

## Animation System

### Keyframes
- `fade-in` - Fade in with slight upward motion
- `fade-in-up/down/left/right` - Directional fade animations  
- `scale-in` - Scale up from 95% to 100%
- `slide-in-from-*` - Slide in from any direction
- `shimmer` - Loading shimmer effect
- `glow` - Subtle glow pulse

### Usage
```jsx
<div className="animate-fade-in">
  Content fades in
</div>

<div className="animate-scale-in">
  Content scales in
</div>
```

## Application-Specific Colors

### Category Colors
```css
--category-books: 217.2 91.2% 59.8%        /* Blue */
--category-electronics: 271.5 81.3% 55.9%   /* Purple */
--category-furniture: 142.1 76.2% 36.3%     /* Green */
--category-clothing: 346.8 77.2% 49.8%      /* Pink */
--category-other: 240 3.7% 15.9%            /* Gray */
```

### Condition Colors  
```css
--condition-new: 142.1 76.2% 36.3%     /* Green - Excellent */
--condition-good: 217.2 91.2% 59.8%    /* Blue - Good */
--condition-fair: 47.9 95.8% 53.1%     /* Yellow - Fair */
--condition-used: 240 5% 64.9%         /* Gray - Used */
```

## Usage Guidelines

### Accessibility
- All interactive elements have minimum 44px touch targets
- Color contrast ratios meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Focus indicators are clearly visible
- Components work with screen readers and keyboard navigation

### Performance
- Use CSS custom properties for consistent theming
- Minimize animation complexity on low-end devices
- Lazy load non-critical design assets

### Consistency
- Always use design tokens instead of arbitrary values
- Follow component patterns for predictable user experience
- Use semantic color names over specific color values
- Maintain consistent spacing using the 4px grid system

### Best Practices
- Prefer composition over deeply nested components
- Use utility classes for one-off styling needs
- Keep components focused and reusable
- Document any deviations from the design system