# 🎨 Food Donation Platform - Design System

## Brand Identity

**Mission:** *"Connecting hearts, feeding souls — one meal at a time"*

**Vision:** A platform where compassion meets action, bridging the gap between surplus and need through technology and humanity.

---

## 🎨 Color Palette

### Primary Colors
```css
--saffron-primary: #FF9933;      /* Warm saffron - Action, Energy */
--saffron-light: #FFB366;        /* Light variant */
--saffron-dark: #E68A2E;         /* Dark variant */

--green-primary: #4CAF50;        /* Hope, Growth */
--green-light: #66BB6A;          /* Light variant */
--green-dark: #388E3C;           /* Dark variant */

--cream: #FFF8E7;                /* Warm background */
--cream-dark: #FFF0CC;           /* Darker cream */

--charcoal: #333333;             /* Primary text */
--charcoal-light: #666666;       /* Secondary text */

--accent-yellow: #FFD54F;        /* Highlights, Success */
--accent-orange: #FF6F00;        /* Urgency, CTAs */
```

### Semantic Colors
```css
--success: #4CAF50;
--warning: #FFD54F;
--error: #F44336;
--info: #2196F3;

--bg-light: #FFFFFF;
--bg-cream: #FFF8E7;
--bg-dark: #1A1A1A;
--bg-card: #FFFFFF;

--text-primary: #333333;
--text-secondary: #666666;
--text-muted: #999999;
--text-inverse: #FFFFFF;
```

### Gradient Combinations
```css
--gradient-warm: linear-gradient(135deg, #FF9933 0%, #FFD54F 100%);
--gradient-hope: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
--gradient-sunset: linear-gradient(135deg, #FF6F00 0%, #FF9933 100%);
--gradient-soft: linear-gradient(135deg, #FFF8E7 0%, #FFFFFF 100%);
```

---

## 📝 Typography

### Font Families
```css
/* Primary Font - Modern, Friendly */
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;

/* Secondary Font - Clean, Readable */
font-family: 'Nunito Sans', 'Segoe UI', Tahoma, sans-serif;

/* Accent Font - Handwritten feel for quotes/testimonials */
font-family: 'Caveat', cursive;
```

### Font Scales

#### Headings
```css
/* Hero Title */
.text-hero {
  font-size: 3.5rem;      /* 56px */
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* H1 - Page Titles */
.text-h1 {
  font-size: 2.5rem;      /* 40px */
  line-height: 1.2;
  font-weight: 700;
}

/* H2 - Section Titles */
.text-h2 {
  font-size: 2rem;        /* 32px */
  line-height: 1.25;
  font-weight: 600;
}

/* H3 - Card Titles */
.text-h3 {
  font-size: 1.5rem;      /* 24px */
  line-height: 1.3;
  font-weight: 600;
}

/* H4 - Subsection */
.text-h4 {
  font-size: 1.25rem;     /* 20px */
  line-height: 1.4;
  font-weight: 600;
}
```

#### Body Text
```css
/* Large Body */
.text-lg {
  font-size: 1.125rem;    /* 18px */
  line-height: 1.6;
}

/* Regular Body */
.text-base {
  font-size: 1rem;        /* 16px */
  line-height: 1.6;
}

/* Small Text */
.text-sm {
  font-size: 0.875rem;    /* 14px */
  line-height: 1.5;
}

/* Extra Small */
.text-xs {
  font-size: 0.75rem;     /* 12px */
  line-height: 1.4;
}
```

---

## 🎭 Spacing System

```css
/* Base unit: 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## 🔲 Border Radius

```css
--radius-sm: 0.375rem;    /* 6px - Buttons, Badges */
--radius-md: 0.5rem;      /* 8px - Cards, Inputs */
--radius-lg: 0.75rem;     /* 12px - Large Cards */
--radius-xl: 1rem;        /* 16px - Modal, Feature Cards */
--radius-2xl: 1.5rem;     /* 24px - Hero Cards */
--radius-full: 9999px;    /* Full round - Avatars, Pills */
```

---

## 🌑 Shadows

```css
/* Light Shadows */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.12);
--shadow-2xl: 0 20px 40px rgba(0, 0, 0, 0.15);

/* Colored Shadows */
--shadow-saffron: 0 8px 20px rgba(255, 153, 51, 0.25);
--shadow-green: 0 8px 20px rgba(76, 175, 80, 0.25);
--shadow-warm: 0 8px 20px rgba(255, 111, 0, 0.25);
```

---

## 🎬 Animation Tokens

### Duration
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
```

### Easing
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Framer Motion Variants
```javascript
// Fade In Up
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Scale In
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Slide In Left
export const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Stagger Children
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Floating Animation
export const floating = {
  y: [-10, 10, -10],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Pulse
export const pulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};
```

---

## 🎯 Component Patterns

### Buttons

#### Primary Button
```jsx
<button className="
  px-6 py-3 
  bg-gradient-to-r from-saffron-primary to-accent-orange
  text-white font-semibold rounded-lg
  shadow-lg hover:shadow-xl
  transform hover:-translate-y-1
  transition-all duration-300
  hover:scale-105
">
  Donate Now
</button>
```

#### Secondary Button
```jsx
<button className="
  px-6 py-3
  bg-white text-saffron-primary
  border-2 border-saffron-primary
  font-semibold rounded-lg
  hover:bg-saffron-primary hover:text-white
  transition-all duration-300
">
  Learn More
</button>
```

#### Ghost Button
```jsx
<button className="
  px-6 py-3
  text-charcoal font-medium
  hover:text-saffron-primary
  hover:bg-cream
  rounded-lg
  transition-all duration-300
">
  View Details
</button>
```

### Cards

#### Donation Card
```jsx
<div className="
  bg-white rounded-xl p-6
  shadow-md hover:shadow-xl
  border border-gray-100
  transform hover:-translate-y-2
  transition-all duration-300
  cursor-pointer
">
  {/* Card Content */}
</div>
```

#### Feature Card
```jsx
<div className="
  bg-gradient-to-br from-cream to-white
  rounded-2xl p-8
  shadow-lg
  border border-saffron-primary/10
">
  {/* Feature Content */}
</div>
```

### Badges

```jsx
{/* Status Badge */}
<span className="
  inline-flex items-center gap-1
  px-3 py-1
  bg-green-100 text-green-700
  rounded-full text-sm font-medium
">
  Available
</span>

{/* Count Badge */}
<span className="
  inline-flex items-center justify-center
  w-6 h-6
  bg-saffron-primary text-white
  rounded-full text-xs font-bold
">
  5
</span>
```

---

## 🌓 Dark Mode

### Dark Mode Colors
```css
/* Dark Theme */
--dark-bg-primary: #1A1A1A;
--dark-bg-secondary: #242424;
--dark-bg-card: #2D2D2D;
--dark-text-primary: #E0E0E0;
--dark-text-secondary: #B0B0B0;
--dark-border: #404040;
```

### Dark Mode Classes
```jsx
// Use dark: prefix in Tailwind
<div className="
  bg-white dark:bg-dark-bg-card
  text-charcoal dark:text-dark-text-primary
  border border-gray-200 dark:border-dark-border
">
  {/* Content */}
</div>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small devices (phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (laptops) */
xl: 1280px  /* Extra large devices (desktops) */
2xl: 1536px /* 2X large devices (large desktops) */
```

---

## 🎨 Icon Guidelines

### Recommended Icons

**Lucide React Icons:**
- Heart (donation, love)
- Users (volunteers, community)
- Package (food items)
- MapPin (locations)
- Clock (time)
- CheckCircle (success, completed)
- AlertCircle (warnings)
- TrendingUp (statistics)

### Icon Sizes
```jsx
<Icon size={16} />  {/* Small - inline with text */}
<Icon size={20} />  {/* Medium - buttons */}
<Icon size={24} />  {/* Large - cards */}
<Icon size={32} />  {/* XL - features */}
<Icon size={48} />  {/* Hero sections */}
```

---

## 🎭 Accessibility

### Color Contrast
- Text on cream background: Use charcoal (#333333) - AAA
- White text on saffron: AA compliant
- All CTA buttons meet WCAG 2.1 AA standards

### Focus States
```css
/* Focus ring for keyboard navigation */
.focus-visible:focus {
  outline: 2px solid #FF9933;
  outline-offset: 2px;
}
```

### Motion Preferences
```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📐 Layout Grid

```jsx
{/* Container */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  
  {/* Grid System */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Grid Items */}
  </div>
  
</div>
```

---

## 🎨 Design Principles

1. **Warmth First**: Every interaction should feel human and caring
2. **Clarity**: Information hierarchy must be obvious
3. **Delight**: Subtle animations that bring joy
4. **Trust**: Professional design builds credibility
5. **Accessibility**: Design for everyone
6. **Performance**: Fast loading, smooth animations
7. **Mobile-First**: Optimize for smallest screens first

---

This design system ensures consistency across the entire platform while maintaining the emotional connection that makes food donation meaningful. Every color, animation, and spacing decision reflects compassion and hope.
