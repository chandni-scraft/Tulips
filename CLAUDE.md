# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Shopify theme named "Tulips" (v1.0.8) - a modern, responsive e-commerce theme built with Liquid, JavaScript, and CSS. The theme includes advanced features like mega menus, product variants, cart functionality, and various interactive components.

## Theme Architecture

### Core Structure
- **Liquid Templates**: `.liquid` files in `templates/`, `sections/`, `snippets/`, and `layout/` directories
- **Assets**: JavaScript (`.js`), CSS (`.css`), images, and font files in `assets/`
- **Configuration**: Theme settings in `config/` directory
- **Localization**: Translation files in `locales/` directory

### Key Components

#### JavaScript Architecture
- **Main JavaScript**: `assets/global.js` - Contains core functionality and web components
- **Component System**: Uses custom elements (e.g., `product-card`, `swiper-component`, `menu-drawer`)
- **Event System**: PubSub pattern for cart updates and variant changes
- **Third-party Libraries**: Swiper.js for carousels, bodyScrollLock for mobile handling

#### CSS Architecture
- **Base Styles**: `base.css` for foundational styles
- **Component Styles**: Modular CSS files for specific components (e.g., `component-cart.css`, `component-drawer.css`)
- **Utility Classes**: Helper classes for spacing, layout, and interactions

#### Shopify Liquid Structure
- **Layout**: `layout/theme.liquid` - Main template with header/footer
- **Sections**: Modular page sections (e.g., `main-product.liquid`, `main-collection.liquid`)
- **Snippets**: Reusable components (e.g., `card-product.liquid`, `price.liquid`)
- **Templates**: Page-specific templates (e.g., `product.liquid`, `collection.liquid`)

## Development Workflow

### Theme Customization
1. **Section Customization**: Modify files in `sections/` for page layout changes
2. **Component Updates**: Edit snippets for reusable component changes
3. **Style Modifications**: Update CSS files in `assets/` for visual changes
4. **Functionality Enhancement**: Modify JavaScript in `assets/global.js` for interactive features

### Product Management
- **Product Cards**: Custom element `product-card` handles variants, pricing, and add-to-cart
- **Variant Selection**: Radio button inputs with dynamic price updates
- **Media Gallery**: Swiper-based image galleries with zoom functionality
- **Quick Cart**: Slide-out cart drawer for immediate checkout

### Cart System
- **Cart Drawer**: Custom element `cart-drawer` for slide-out shopping cart
- **Cart Notifications**: Toast notifications for add-to-cart confirmations
- **Free Shipping**: Dynamic progress bar showing remaining amount for free shipping
- **Quantity Controls**: Custom quantity input component with increment/decrement

## Key Features

### Responsive Design
- **Breakpoints**: Mobile (<750px), Tablet (750-990px), Desktop (>990px)
- **Touch Optimization**: Mobile-first approach with touch-friendly interactions
- **Adaptive Components**: Components that adapt behavior based on device

### Mega Menu System
- **Multi-level Navigation**: Supports nested dropdown menus
- **Mobile Drawer**: Slide-out navigation for mobile devices
- **Transparent Header**: Dynamic header styling for hero sections
- **Search Integration**: Predictive search with keyboard navigation

### Product Features
- **Variant Management**: Dynamic variant selection with availability checking
- **Product Media**: Image galleries, video support, and 3D models
- **Product Recommendations**: AI-powered product suggestions
- **Recently Viewed**: Browser-based product history

### Interactive Elements
- **Swiper Carousels**: Touch-enabled sliders for products and content
- **Accordion Components**: Collapsible content sections
- **Countdown Timers**: Real-time countdown functionality
- **Text Truncation**: Expandable text blocks for long descriptions

## Performance Optimizations

### Image Handling
- **Lazy Loading**: Native lazy loading for images with fade-in animations
- **Responsive Images**: Automatic srcset generation for different screen sizes
- **WebP Support**: Modern image format support where available

### JavaScript Optimization
- **Component Lazy Loading**: Dynamic initialization of components
- **Event Delegation**: Efficient event handling for dynamic content
- **RequestAnimationFrame**: Smooth animations and scroll handling

### CSS Optimization
- **Critical CSS**: Inline critical styles for fast rendering
- **Component Scoping**: Scoped CSS to prevent conflicts
- **Animation Performance**: GPU-accelerated animations

## Custom Integrations

### Third-party Services
- **Google Analytics**: E-commerce tracking implementation
- **Meta Pixel**: Facebook advertising integration
- **Shopify Payments**: Native payment processing
- **Subify**: Subscription service integration

### Custom Components
- **Notify Me**: Stock notification system for out-of-stock products
- **Store Locator**: Physical store finder with map integration
- **Age Verification**: Popup for age-restricted products

## Common Development Tasks

### Adding New Sections
1. Create `.liquid` file in `sections/` directory
2. Add schema settings in `config/settings_schema.json`
3. Create corresponding CSS in `assets/`
4. Add JavaScript functionality to `assets/global.js`

### Modifying Product Display
1. Update `snippets/card-product.liquid` for product cards
2. Modify `sections/main-product.liquid` for product pages
3. Update variant handling in `product-card` component

### Styling Changes
1. Modify `base.css` for global styles
2. Update component-specific CSS files
3. Use CSS custom properties for theme consistency

### JavaScript Enhancements
1. Add new custom elements to `assets/global.js`
2. Use existing utility functions for consistency
3. Follow event-driven architecture for component communication

## Theme Settings

### Customization Options
- Theme colors and typography
- Layout and spacing preferences
- Product card display options
- Cart and checkout behavior
- Social media integration

### Performance Settings
- Lazy loading configuration
- Image optimization settings
- Script loading preferences

## Browser Support

### Modern Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Support
- iOS Safari (iOS 12+)
- Chrome Mobile (Android 8+)
- Samsung Internet (latest)

## Accessibility

### WCAG Compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management for modals and drawers

### Performance
- Lighthouse optimization
- Core Web Vitals compliance
- Mobile performance optimization