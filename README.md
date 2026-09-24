# FK Novo Doba Website

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat&logo=vercel)](https://fknovodoba.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-98.7%25-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0.1-646CFF?style=flat&logo=vite)](https://vitejs.dev/)

A modern, responsive website for FK Novo Doba football club built with React, TypeScript, and Firebase. The site features real-time match updates, player rosters, league standings, news management, and a comprehensive admin dashboard.

## 🌐 Live Demo

Visit the live website: [fknovodoba.com](https://fknovodoba.com)

## ✨ Features

### Public Features
- **🏠 Home Page** - Club overview and latest updates
- **⚽ Live Matches** - Real-time match updates and commentary
- **📅 Fixtures & Results** - Upcoming and past matches
- **👥 Team Roster** - Player profiles and statistics
- **📊 League Standings** - Current league table and statistics
- **📰 News** - Latest club news and announcements
- **🌍 Internationalization** - Multi-language support (i18n)
- **📱 Progressive Web App (PWA)** - Installable and works offline
- **🎨 Smooth Animations** - Powered by Framer Motion
- **🌙 Modern UI** - Built with Tailwind CSS v4

### Admin Features
- **🔐 Admin Dashboard** - Protected admin area
- **📝 Match Management** - Create and update match information
- **🎙️ Live Commentary** - Real-time match commentary updates
- **📰 News Management** - Create, edit, and publish news articles
- **👤 Player Management** - Manage player profiles and statistics
- **📊 Standings Management** - Update league table
- **🔴 Live Match Control** - Manage live match status

## 🛠️ Tech Stack

### Frontend
- **React 19.2.4** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 8.0.1** - Build tool and dev server
- **React Router DOM 7.13.1** - Client-side routing
- **Tailwind CSS 4.2.2** - Utility-first CSS framework
- **Framer Motion 12.38.0** - Animation library
- **Lucide React** - Icon library

### Backend & Services
- **Firebase 12.11.0** - Backend services
  - Authentication
  - Firestore Database
  - Storage (for images)

### State Management & Data Fetching
- **TanStack Query (React Query) 5.91.2** - Server state management

### Internationalization
- **react-i18next 17.0.1** - i18n framework
- **i18next-browser-languagedetector** - Automatic language detection
- **country-flag-icons** - Country flag components

## 📁 Project Structure

```
fk-novo-doba/
├── public/
│   ├── icons/           # PWA icons
│   ├── favicon.svg      # Site favicon
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service worker
├── src/
│   ├── assets/
│   │   ├── logos/      # Team and sponsor logos
│   │   └── sponsors/   # Sponsor images
│   ├── components/
│   │   ├── AnimatedRoutes.tsx
│   │   ├── AppContent.tsx
│   │   ├── AppLoader.tsx
│   │   ├── Footer.tsx
│   │   ├── LiveBadge.tsx
│   │   ├── Navbar.tsx
│   │   ├── PageTransition.tsx
│   │   ├── PlayerOfTheMatch.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── ScrollToTopButton.tsx
│   │   └── SkeletonCard.tsx
│   ├── firebase/
│   │   └── config.ts    # Firebase configuration
│   ├── hooks/           # Custom React hooks
│   ├── i18n/           # Internationalization files
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminMatches.tsx
│   │   │   ├── AdminLive.tsx
│   │   │   ├── AdminCommentary.tsx
│   │   │   ├── AdminNews.tsx
│   │   │   ├── AdminPlayers.tsx
│   │   │   └── AdminStandings.tsx
│   │   ├── Fixtures.tsx
│   │   ├── League.tsx
│   │   ├── LiveMatch.tsx
│   │   ├── News.tsx
│   │   ├── Player.tsx
│   │   ├── Results.tsx
│   │   └── Roster.tsx
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Root component
│   ├── index.css       # Global styles
│   └── main.tsx        # Entry point
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript configuration
├── vercel.json         # Vercel deployment config
└── vite.config.ts      # Vite configuration
```

## 🔧 Technology Overview

### Backend Services
The application uses Firebase for backend functionality:
- **Authentication** - Secure admin access
- **Firestore Database** - Real-time data storage
- **Storage** - Media file management

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌍 Internationalization

The application supports multiple languages through react-i18next. Language files are located in `src/i18n/`.

To add a new language:
1. Create a new translation file in `src/i18n/locales/`
2. Import and configure in `src/i18n/config.ts`
3. Language is automatically detected from browser settings

## 📱 PWA Features

The application is a Progressive Web App with:
- Offline functionality via service worker
- Installable on mobile devices
- App-like experience
- Cached resources for faster loading

## 🎨 Styling

The project uses Tailwind CSS v4 with:
- Utility-first approach
- Custom design system via Vite plugin
- Responsive design
- Dark mode support (if implemented)

## 🔧 Admin Panel

The admin panel provides comprehensive management tools for maintaining the website's content and match data.

## 🤝 Contributing

This is a private project for FK Novo Doba football club.

## 📄 License

This project is private. All rights reserved.

## 👤 Author

**Igor Marković**
- GitHub: [@igormarkovic11](https://github.com/igormarkovic11)

## 🙏 Acknowledgments

- React team for the amazing library
- Firebase for backend infrastructure
- Tailwind CSS for the styling framework
- Vercel for hosting
