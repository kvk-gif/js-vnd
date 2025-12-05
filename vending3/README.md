# Vending Machine Application

A modern, responsive vending machine simulator built with simplified React and enhanced with vanilla JavaScript features.

## Features

### Core Functionality
- **Interactive Product Selection**: Browse and select from up to 9 different products displayed in a glass-front vending machine interface
- **Coin Payment System**: Insert coins to purchase products (€2, €1, 50c, 20c, 10c)
- **Automatic Change Calculation**: The machine automatically calculates and displays change
- **Real-time Inventory**: View current stock levels for each product (max 15 per product type)
- **Admin Panel**: Full CRUD operations for managing products (Create, Read, Update, Delete)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Enhanced Vanilla JavaScript Features
- **🔊 Sound Effects**: Web Audio API generates realistic sounds for:
  - Coin insertion (metallic clink)
  - Button clicks
  - Successful purchases (success chime)
  - Errors (warning buzz)
  - Coin refunds
- **💾 LocalStorage Persistence**: Product inventory automatically saves to browser localStorage and persists between sessions
- **✨ Custom Animations**: Vanilla JS animations for:
  - Coin drop effects
  - Product dispensing
  - Pulsing glow effects
  - Error shake animations
- **🎯 Direct DOM Manipulation**: Efficient vanilla JavaScript for interactive elements

## Accepted Currency

The vending machine accepts Euro coins:
- **€2**: €2.00 🥇
- **€1**: €1.00 🥈
- **50 Cent**: €0.50 🟡
- **20 Cent**: €0.20 ⚪
- **10 Cent**: €0.10 🟤

## Operations

### Customer Operations
1. **Insert Coins**: Click on coin buttons to add money (plays sound effect)
2. **Select Product**: Click on any available product in the display
3. **Purchase**: Click "Purchase" button when sufficient funds are inserted
4. **Return Coins**: Click "Return Coins" to cancel and get money back (plays refund sound)

### Admin Operations
Access the Admin Panel tab to:
- **Add New Products**: Create new products with custom name, price, emoji, and quantity
- **Edit Products**: Modify existing product details
- **Delete Products**: Remove products from the machine
- **Update Inventory**: Adjust stock levels (maximum 15 per product)

All admin changes are automatically saved to localStorage!

## Technical Implementation

### Simplified React Structure
- **Single-file component**: All vending machine logic in one place
- **Minimal state management**: Only essential state variables
- **Direct event handlers**: Simple, straightforward event handling
- **No over-abstraction**: Clear, readable code without unnecessary components

### Vanilla JavaScript Enhancements

#### Sound System (`src/lib/sounds.ts`)
- Web Audio API for synthesized sound effects
- No external audio files needed
- Automatic initialization on first user interaction
- Multiple oscillator types (sine, square, sawtooth) for different effects

#### Storage System (`src/lib/storage.ts`)
- LocalStorage API for data persistence
- JSON serialization for product data
- Error handling for storage failures
- Automatic save/load on app lifecycle

#### Animation System (`src/lib/animations.ts`)
- CSS animations triggered via vanilla JS
- DOM manipulation for dynamic effects
- Custom keyframe animations
- Element reference management

## Getting Started

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

## Technology Stack

- **React 18** - Simplified component structure
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with design system
- **Vite** - Build tool
- **Vanilla JavaScript** - Sound effects, storage, animations
- **Web Audio API** - Sound generation
- **LocalStorage API** - Data persistence
- **shadcn/ui** - UI components
- **Sonner** - Toast notifications

## Project Structure

```
src/
├── lib/
│   ├── animations.ts      # Vanilla JS animation utilities
│   ├── sounds.ts          # Web Audio API sound effects
│   ├── storage.ts         # LocalStorage management
│   └── mockApi.ts         # Initial data fetching
├── types/
│   └── product.ts         # TypeScript interfaces
└── pages/
    └── Index.tsx          # Main application (simplified single-file)
```

## Design Features

- Modern retro-futuristic aesthetic with teal and coral accent colors
- Smooth animations powered by vanilla JavaScript
- Digital display with monospace font for authentic vending machine feel
- Glass-front effect showing products behind transparent layer
- Responsive grid layout adapting to all screen sizes
- Sound feedback for all user interactions
- Persistent data storage across browser sessions

## Data Persistence

Product data is automatically saved to browser localStorage after every change. The app will:
1. Load saved products from localStorage on startup
2. Fall back to mock API if no saved data exists
3. Auto-save all admin changes immediately
4. Persist inventory changes (purchases, restocking)

To reset to default products, clear your browser's localStorage for this site.

## Browser Compatibility

- Modern browsers with ES6+ support
- Web Audio API support (all major browsers)
- LocalStorage support (universal)
- No external dependencies for sounds or storage
