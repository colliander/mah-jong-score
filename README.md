# Mah-Jong Score App

A comprehensive Angular web application for managing Mah-Jong games, players, and scoring. This app provides an intuitive interface for registering scores, managing players, and tracking game progress with beautiful tile visualizations.

## Features

- 🎮 **Game Management**: Create and manage Mah-Jong games
- 👥 **Player Management**: Add, remove, and manage players with database integration
- 🀄 **Score Registration**: Intuitive tile selection interface with visual feedback
- 🎯 **Automatic Scoring**: Intelligent tile grouping and point calculation
- 📱 **Responsive Design**: Works great on desktop and mobile devices
- 🔄 **Real-time Updates**: Live game state management with Angular signals
- 🎨 **Beautiful UI**: Modern design with smooth animations and visual feedback

## Technology Stack

- **Frontend**: Angular 18 with TypeScript
- **Styling**: CSS3 with custom animations and responsive design
- **State Management**: Angular Signals for reactive state management
- **Backend Integration**: REST API with token authentication
- **Assets**: Custom SVG tile images for authentic Mah-Jong experience

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Angular CLI: `npm install -g @angular/cli`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/colliander/mah-jong-score.git
cd mah-jong-score
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Navigate to `http://localhost:4200/` in your browser

### Configuration

Update the API endpoint in `src/app/services/api.service.ts` to point to your backend server:

```typescript
private baseUrl = 'your-backend-api-url';
```

## Project Structure

```
src/
├── app/
│   ├── components/           # Angular components
│   │   ├── game-management.component.ts
│   │   ├── game-selection.component.ts
│   │   ├── player-management.component.ts
│   │   └── score-registration.component.ts
│   ├── services/            # Angular services
│   │   ├── api.service.ts
│   │   └── game-state.service.ts
│   └── assets/
│       └── tiles/           # SVG tile images (Dragons, Winds, Suits, etc.)
```

## Key Components

### Score Registration
- Interactive tile selection with visual feedback
- Automatic hand grouping (Pongs, Chows, Kongs)
- Player selection with checkmark indicators
- Wind selection and scoring calculations

### Player Management
- Add new players or select from existing database
- Real-time validation and feedback
- Support for 4-player Mah-Jong games
- Player identification with email integration

### Game Management
- Create and join games
- Game state persistence
- Multi-game support with unique identifiers

## Building for Production

Build the project for production deployment:

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory, ready for deployment to any static hosting service.

## API Integration

The app integrates with a backend API for:
- Player management (CRUD operations)
- Game creation and management
- Score submission with structured hand data
- Authentication with token-based security

## Deployment

This app can be deployed to any static hosting service such as:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

Simply upload the contents of the `dist/mahjong-app/browser/` folder after building.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Created by colliander - A modern web application for Mah-Jong enthusiasts!
