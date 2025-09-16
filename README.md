# AykutKaya Games - Game Review Website

A modern, responsive game review website built with Next.js, TypeScript, and Tailwind CSS featuring dark/light mode support.

## Features

- 🎮 **Game Discovery**: Browse and search through a curated collection of games
- 🔍 **Advanced Search**: Filter games by title, description, and categories
- 🌙 **Dark/Light Mode**: Toggle between themes with automatic system preference detection
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⭐ **Rating System**: Visual star ratings for all games
- 🏷️ **Category Filtering**: Organize games by genres and categories

## Tech Stack

- **Framework**: Next.js 14.2.13 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Theme Management**: React Context API
- **Icons**: Heroicons (SVG)

## Project Structure

```
aykutkaya/
├── app/
│   ├── api/games/route.ts     # Games API endpoint
│   ├── games/[slug]/page.tsx  # Dynamic game detail pages
│   ├── layout.tsx             # Root layout with theme provider
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/
│   ├── Footer.tsx             # Site footer
│   ├── GameCard.tsx           # Individual game card
│   ├── GameList.tsx           # Grid of game cards
│   ├── Navbar.tsx             # Navigation with theme toggle
│   └── SearchBar.tsx          # Search and filter controls
├── contexts/
│   └── ThemeContext.tsx       # Theme management context
├── data/
│   └── games.json             # Game data source
├── types/
│   └── game.ts                # TypeScript interfaces
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── next.config.mjs
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aykutkaya
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Game Data Structure

Each game in `data/games.json` follows this schema:

```json
{
  "id": 1,
  "title": "Game Title",
  "slug": "game-title",
  "thumbnail": "https://example.com/image.jpg",
  "shortDesc": "Brief description for cards",
  "fullDesc": "Detailed description for game pages",
  "rating": 9.5,
  "categories": ["RPG", "Open World"]
}
```

## Features Detail

### Navigation
- Responsive navbar with mobile menu
- Dark/light theme toggle
- Navigation links: Home, Games, Reviews, Forum

### Search & Filter
- Real-time search by game title and description
- Category-based filtering
- Results counter
- Client-side filtering for fast performance

### Game Cards
- Thumbnail images
- Star rating display (visual + numeric)
- Category tags
- Hover effects and transitions
- Direct links to detailed pages

### Game Detail Pages
- Large featured image
- Complete game information
- Full description
- Category tags
- Back navigation
- Responsive layout

### Theme System
- System preference detection
- Persistent theme selection
- Smooth transitions between themes
- Dark/light mode for all components

## Responsive Design

- **Desktop**: 3-column grid layout
- **Tablet**: 2-column grid layout  
- **Mobile**: 1-column layout
- Flexible navigation with mobile menu
- Optimized typography and spacing

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

© 2025 aykutkaya.tr - All rights reserved

## Contributing

This is a portfolio project. For suggestions or issues, please contact the developer.