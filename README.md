# F1 Tracker

A React web application that displays current F1 driver standings using the [F1 API](https://f1api.dev/).

## Features

- 🏎️ **Real-time F1 Data**: Shows latest session results from OpenF1 API
- 📊 **Driver Standings**: Displays driver positions, points, and team information
- 🎨 **Modern UI**: Clean, responsive design with F1-themed styling
- ⚡ **Fast Loading**: Optimized API calls with parallel requests
- 🔄 **Auto-updates**: Shows latest data after each F1 session

## Technology Stack

- **React** with TypeScript
- **Tailwind CSS** for styling
- **F1 API** for F1 data
- **Custom hooks** for data management

## API Used

This project uses the [F1 API](https://f1api.dev/) which provides:
- Direct access to current championship standings
- No authentication required
- Free to use
- Official F1 data

### Endpoints Used
- `https://f1api.dev/api/current/drivers-championship` - Current season championship standings

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Project Structure

```
src/
├── hooks/
│   └── useDriverStandings.ts    # Custom hook for F1 data
├── card/
│   ├── Card.tsx                 # Driver card component
│   ├── card.css                 # Card styles
│   └── types.ts                 # TypeScript types
├── App.tsx                      # Main application component
└── index.tsx                    # Application entry point
```

## How It Works

1. The app fetches the latest session results from OpenF1 API
2. Driver information is retrieved in parallel
3. Data is converted to the app's format
4. Driver cards are displayed with positions, points, and team info
5. Updates automatically after each F1 session

## Credits

- **OpenF1 API**: [https://openf1.org/](https://openf1.org/) - Free F1 data API
- **Formula 1**: Official F1 data and imagery
