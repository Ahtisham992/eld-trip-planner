# 🎨 Styles & Theme Guide — ELD Trip Planner

---

## Design Philosophy

The ELD Trip Planner targets a **professional trucking/logistics audience**. The design should feel:

- **Premium & Modern** — Dark theme with glassmorphism, subtle gradients, and micro-animations
- **Professional** — Clean, organized layouts that inspire confidence in accuracy
- **Data-Dense but Clear** — Maps, timelines, and log grids need to display a lot of information without clutter
- **Responsive** — Works on desktop (primary) and tablet screens

> **Inspiration**: Think dashboards like Linear, Vercel Dashboard, or Fleet Management platforms — dark, sleek, data-rich.

---

## Color Palette

### Primary Colors (Dark Theme)

| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#0a0e1a` | Main background (deep navy/black) |
| `--bg-secondary` | `#111827` | Card/panel backgrounds |
| `--bg-tertiary` | `#1e293b` | Elevated surfaces, inputs |
| `--bg-glass` | `rgba(17, 24, 39, 0.7)` | Glassmorphism panels |
| `--surface-hover` | `#1e3a5f` | Hover states |

### Accent Colors

| Token | Hex | Usage |
|---|---|---|
| `--accent-primary` | `#10b981` | Primary actions, active states (Emerald) |
| `--accent-primary-hover` | `#059669` | Hover state for primary accent |
| `--accent-secondary` | `#3b82f6` | Links, secondary highlights (Blue) |
| `--accent-warning` | `#f59e0b` | Warnings, fuel stops (Amber) |
| `--accent-danger` | `#ef4444` | Errors, required rest (Red) |
| `--accent-info` | `#8b5cf6` | Info badges, sleeper berth (Purple) |

### Text Colors

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#f1f5f9` | Primary text (near white) |
| `--text-secondary` | `#94a3b8` | Secondary/muted text |
| `--text-tertiary` | `#64748b` | Disabled, labels |
| `--text-inverse` | `#0f172a` | Text on light backgrounds |

### ELD Log Colors (Duty Statuses)

| Status | Color | Hex |
|---|---|---|
| Off Duty | Green | `#10b981` |
| Sleeper Berth | Purple | `#8b5cf6` |
| Driving | Blue | `#3b82f6` |
| On Duty (Not Driving) | Amber | `#f59e0b` |

### Map Marker Colors

| Marker | Color | Hex |
|---|---|---|
| Start/Current | Blue | `#3b82f6` |
| Pickup | Emerald | `#10b981` |
| Dropoff | Red | `#ef4444` |
| Rest Stop | Purple | `#8b5cf6` |
| Fuel Stop | Amber | `#f59e0b` |
| 30-min Break | Teal | `#14b8a6` |

---

## Typography

### Font Stack

```css
/* Primary — UI text */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace — Numbers, log data, coordinates */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--text-xs` | 0.75rem (12px) | 400 | 1.5 | Captions, timestamps |
| `--text-sm` | 0.875rem (14px) | 400 | 1.5 | Secondary text, labels |
| `--text-base` | 1rem (16px) | 400 | 1.6 | Body text |
| `--text-lg` | 1.125rem (18px) | 500 | 1.5 | Subtitles |
| `--text-xl` | 1.25rem (20px) | 600 | 1.4 | Section headers |
| `--text-2xl` | 1.5rem (24px) | 700 | 1.3 | Page titles |
| `--text-3xl` | 2rem (32px) | 800 | 1.2 | Hero text |

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## Spacing Scale

```css
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
```

---

## Elevation & Effects

### Border Radius

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(16, 185, 129, 0.15);
```

### Glassmorphism

```css
.glass-panel {
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
```

### Gradient Accents

```css
--gradient-primary: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
--gradient-hero: linear-gradient(135deg, #0a0e1a 0%, #1e293b 50%, #0a0e1a 100%);
--gradient-card-border: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.3));
```

---

## Component Styles

### Input Fields

```css
.input-field {
  background: var(--bg-tertiary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  color: var(--text-primary);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.input-field::placeholder {
  color: var(--text-tertiary);
}
```

### Buttons

```css
.btn-primary {
  background: var(--gradient-primary);
  color: white;
  font-weight: 600;
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}
```

### Cards / Panels

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all 0.3s ease;
}

.card:hover {
  border-color: rgba(16, 185, 129, 0.2);
  box-shadow: var(--shadow-glow);
}
```

### Status Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-driving    { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.badge-rest       { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.badge-fuel       { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.badge-sleeper    { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
```

---

## Animations & Transitions

### Standard Transitions

```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Key Animations

```css
/* Fade in from bottom */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Pulse glow for loading/active states */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
  50%      { box-shadow: 0 0 25px rgba(16, 185, 129, 0.4); }
}

/* Slide in for panels/results */
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Route line drawing animation */
@keyframes drawRoute {
  from { stroke-dashoffset: 1000; }
  to   { stroke-dashoffset: 0; }
}

/* Spin for loading */
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Micro-Interactions

- **Input focus**: Subtle border glow + scale(1.01)
- **Button hover**: translateY(-2px) + shadow increase
- **Card hover**: Border glow + slight shadow expansion
- **Map markers**: Bounce animation on appearance
- **Results section**: staggered fadeInUp with 100ms delay per element
- **ELD log lines**: Draw-on animation from left to right
- **Tab switching**: Smooth crossfade

---

## Responsive Breakpoints

```css
/* Mobile first approach */
--bp-sm: 640px;    /* Small tablets */
--bp-md: 768px;    /* Tablets */
--bp-lg: 1024px;   /* Small desktops */
--bp-xl: 1280px;   /* Large desktops */
--bp-2xl: 1536px;  /* Extra large */
```

### Layout Rules

| Breakpoint | Layout |
|---|---|
| `< 768px` | Single column, stacked sections |
| `768px – 1024px` | Form sidebar (30%) + Map (70%) |
| `> 1024px` | Full layout: Form (25%) + Map (75%), full-width ELD logs below |

---

## ELD Log Sheet Canvas Styling

The ELD log canvas should mimic the official FMCSA paper log appearance:

| Element | Style |
|---|---|
| **Grid background** | White (`#ffffff`) or very light gray (`#fafafa`) |
| **Grid lines (major)** | `#333333`, 1px solid — hour boundaries |
| **Grid lines (minor)** | `#cccccc`, 0.5px solid — 15-min marks |
| **Status row labels** | Black, 11px, left-aligned |
| **Time labels** | Black, 10px, centered above each hour column |
| **Duty status lines** | Bold 3px lines in corresponding duty color |
| **Vertical transitions** | 2px lines connecting status changes |
| **Total hours column** | Right side, monospace font, bold |
| **Header area** | Log date, from/to, carrier info — above the grid |
| **Remarks area** | Below the grid — city/state at each status change |

### Canvas Dimensions

```
Total canvas: ~900px wide × ~650px tall
Grid area:    ~750px wide × ~200px tall
Header:       ~900px wide × ~180px tall
Remarks:      ~900px wide × ~180px tall
Recap:        ~900px wide × ~90px tall
```

---

## Accessibility Standards

- **Contrast**: All text meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- **Focus indicators**: Visible focus rings on all interactive elements
- **Color not sole indicator**: Icons and labels supplement color-coded statuses
- **Keyboard navigation**: Full tab-order through form and controls
- **Screen reader**: Proper ARIA labels on map, canvas, and interactive elements
- **Reduced motion**: Respect `prefers-reduced-motion` media query

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
# #   B r a n d i n g   &   L o g o \ n \ n T h e   a p p l i c a t i o n   f e a t u r e s   a   c u s t o m - g e n e r a t e d   g e o m e t r i c   v e c t o r   l o g o   ( R o u t e S y n c   E L D )   r e p r e s e n t i n g   c o n n e c t e d   n o d e s   a n d   r o u t i n g   l o g i c .   I t   i s   c o n v e r t e d   t o   t r a n s p a r e n t   P N G   a n d   a p p l i e d   g l o b a l l y   a s   t h e   s i t e   f a v i c o n   a n d   a p p l i c a t i o n   s i d e b a r   b r a n d i n g . \ n \ n # #   C u s t o m   C o m p o n e n t s \ n \ n -   * * F l o a t i n g I n f o   W i d g e t : * *   A   g l o b a l   f l o a t i n g   a c t i o n   b u t t o n   p r o v i d i n g   a s s e s s m e n t   d e t a i l s   a n d   p r o f e s s i o n a l   l i n k s   w i t h o u t   c l u t t e r i n g   t h e   m a i n   n a v i g a t i o n . \ n -   * * S e t t i n g s   I n t e r f a c e : * *   A   d e d i c a t e d   s e t t i n g s   c o n t r o l   p a n e l   a l l o w i n g   f o r   s i m u l a t e d   c a r r i e r   p r e f e r e n c e   t o g g l i n g   a n d   t h e m e   p r e v i e w i n g .  
 