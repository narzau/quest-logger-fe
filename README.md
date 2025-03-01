# ADHD Quest Tracker - Frontend

A gamified task tracker Progressive Web App (PWA) designed specifically for people with ADHD. This application transforms ordinary task tracking into an engaging, game-like experience inspired by video game quest logs.

## Features

- **Gamified Task Management**: Turn your tasks into quests with rarities, priorities, and XP rewards
- **ADHD-Friendly Design**: Intuitive, engaging interface with visual elements to help with focus and motivation
- **Level System**: Gain experience points by completing quests and level up
- **Achievement System**: Unlock achievements for consistent quest completion
- **Daily Quests**: Build habits with recurring daily quests
- **Quest Types**: From simple daily tasks to epic projects, categorize your quests accordingly
- **Dark Mode**: Reduce eye strain with built-in dark mode
- **Progressive Web App**: Install on any device for offline functionality

## Technology Stack

- **Frontend Framework**: Next.js (App Router)
- **Language**: TypeScript
- **State Management**: Zustand for global state
- **API Integration**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Form Management**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **PWA Support**: next-pwa

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Backend API running (see backend repository)

### Installation

1. Clone this repository

```bash
git clone https://github.com/yourusername/adhd-quest-tracker.git
cd adhd-quest-tracker
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Configure the backend API endpoint in `next.config.js`

```js
async rewrites() {
  return [
    {
      source: '/api/v1/:path*',
      destination: 'http://your-backend-url/api/v1/:path*',
    },
  ];
}
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
# or
yarn build
```

### Generate a PWA

The project is configured to generate a PWA during the build process. After building, you can start the production server:

```bash
npm run start
# or
yarn start
```

### PWA Features

The PWA implementation includes:

- Service Workers for offline functionality
- Web App Manifest for installability
- Proper caching strategies for assets
- Push notification support

## Project Structure

```
adhd-quest-tracker/
├── public/             # Static assets and PWA manifest
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and API client
│   ├── store/          # Zustand store definitions
│   └── types/          # TypeScript type definitions
```

## Key Components

- **AuthGuard**: Protects routes requiring authentication
- **DashboardLayout**: Main layout for authenticated pages
- **QuestItem**: Reusable quest component
- **CreateQuestDialog**: Form for creating new quests
- **AchievementCard**: Displays achievement information
- **LevelProgressBar**: Shows user level and progress

## State Management

The application uses Zustand for global state management:

- **userStore**: Manages user authentication and profile data
- **questStore**: Handles quest data (CRUD operations)
- **achievementStore**: Tracks user achievements
- **settingsStore**: Stores user preferences

## API Integration

React Query is used for server state management and API integration:

- **useQuests**: Hook for fetching and managing quests
- **useUser**: Hook for user data
- **useAchievements**: Hook for achievement data

## Deployment

This application can be deployed to any hosting service that supports Next.js applications:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Traditional hosting with Node.js

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Next.js and React teams
- shadcn/ui for the amazing component library
- TanStack Query team

---

Built with ❤️ for the ADHD community
